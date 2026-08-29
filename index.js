import { defineTool } from "@deepseek-ai/dsh-tools";
import { execFile } from "node:child_process";
import * as path from "node:path";
import * as fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const name = "dsh-plugin-webnovel";
const inject = ["tools", "systemPrompt"];

const TEXT_OUTPUT = {
  schema: { type: "string" },
  render: function (_args, value) {
    return [{ type: "text", text: String(value == null ? "" : value) }];
  }
};

/**
 * Execute python script from webnovel-writer engine
 */
function runPythonEngine(args, cwd) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "webnovel-writer", "scripts", "webnovel.py");
    const projectDir = cwd || process.cwd();
    
    // Command line args: python -X utf8 webnovel.py --project-root <dir> <...args>
    const fullArgs = ["-X", "utf8", scriptPath, "--project-root", projectDir, ...args];
    
    execFile("python", fullArgs, { cwd: projectDir, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        resolve(`[Webnovel Engine Error] ${error.message}\n${stderr || ""}\n${stdout || ""}`);
      } else {
        resolve(stdout || stderr || "Execution completed successfully.");
      }
    });
  });
}

function apply(ctx, config) {
  // Inject webnovel system prompt section
  ctx.systemPrompt.section({
    name: "tool:webnovel",
    order: 125,
    text: `You are equipped with the Web Novel Writing Engine (dsh-plugin-webnovel).
Use the webnovel_* tools to orchestrate long-form fiction and maintain story consistency:
- webnovel_init: Initialize world setting, character lore, cheat/power system, and master outline.
- webnovel_plan: Break down volumes and plan individual chapters with hooks and goals.
- webnovel_write: Prepare context and draft high-quality chapters with fast pacing and cliffhangers.
- webnovel_review: Review chapter quality, consistency, OOC (out-of-character), pacing, and satisfaction points.
- webnovel_status: View current project status, volume progress, and word count.
- webnovel_doctor: Perform health check on project files, database, and consistency state.
- webnovel_query: Query character states, timeline events, and foreshadowing tracking.`
  });

  // 1. Tool: webnovel_init
  ctx.tools.register(defineTool({
    name: "webnovel_init",
    description: "Khởi tạo một tác phẩm Web Novel mới (thiết lập thế giới, nhân vật, kim thủ chỉ, dàn ý tổng).",
    parameters: {
      title: { type: "string", required: true, description: "Tên tác phẩm / Tên truyện" },
      genre: { type: "string", description: "Thể loại (Tiên hiệp, Đô thị, Huyền huyễn, Khoa huyễn, Võng du...)" },
      projectPath: { type: "string", description: "Đường dẫn thư mục dự án (mặc định là thư mục hiện tại)" }
    },
    output: TEXT_OUTPUT,
    async execute(args) {
      const targetDir = args.projectPath ? path.resolve(args.projectPath) : process.cwd();
      const output = await runPythonEngine(["init"], targetDir);
      return `[Webnovel Init] Đã khởi tạo dự án "${args.title}" tại ${targetDir}:\n${output}`;
    }
  }));

  // 2. Tool: webnovel_status
  ctx.tools.register(defineTool({
    name: "webnovel_status",
    description: "Kiểm tra trạng thái dự án truyện, tiến độ viết các quyển, số chương và từ vựng.",
    parameters: {
      projectPath: { type: "string", description: "Đường dẫn thư mục dự án (mặc định là thư mục hiện tại)" }
    },
    output: TEXT_OUTPUT,
    async execute(args) {
      const targetDir = args.projectPath ? path.resolve(args.projectPath) : process.cwd();
      return await runPythonEngine(["status"], targetDir);
    }
  }));

  // 3. Tool: webnovel_doctor
  ctx.tools.register(defineTool({
    name: "webnovel_doctor",
    description: "Kiểm tra sức khỏe dữ liệu dự án truyện (phát hiện lỗi logic, RAG, database, file thiếu).",
    parameters: {
      projectPath: { type: "string", description: "Đường dẫn thư mục dự án (mặc định là thư mục hiện tại)" }
    },
    output: TEXT_OUTPUT,
    async execute(args) {
      const targetDir = args.projectPath ? path.resolve(args.projectPath) : process.cwd();
      return await runPythonEngine(["doctor"], targetDir);
    }
  }));

  // 4. Tool: webnovel_write
  ctx.tools.register(defineTool({
    name: "webnovel_write",
    description: "Chuẩn bị ngữ cảnh, trích xuất dữ liệu trí nhớ RAG và hỗ trợ viết chương truyện.",
    parameters: {
      chapterNumber: { type: "number", required: true, description: "Số thứ tự chương (ví dụ: 1, 2, 3...)" },
      chapterTitle: { type: "string", description: "Tiêu đề chương" },
      projectPath: { type: "string", description: "Đường dẫn thư mục dự án" }
    },
    output: TEXT_OUTPUT,
    async execute(args) {
      const targetDir = args.projectPath ? path.resolve(args.projectPath) : process.cwd();
      const contextInfo = await runPythonEngine(["extract-context", "--chapter", String(args.chapterNumber)], targetDir);
      return `[Webnovel Write Engine] Ngữ cảnh cho Chương ${args.chapterNumber} (${args.chapterTitle || "Chưa đặt tên"}):\n${contextInfo}`;
    }
  }));

  // 5. Tool: webnovel_commit_state
  ctx.tools.register(defineTool({
    name: "webnovel_commit_state",
    description: "Cập nhật các sự kiện, tiến độ và trạng thái mới sau khi hoàn thành một chương truyện vào bộ nhớ dài hạn.",
    parameters: {
      chapterNumber: { type: "number", required: true, description: "Số thứ tự chương vừa viết xong" },
      projectPath: { type: "string", description: "Đường dẫn thư mục dự án" }
    },
    output: TEXT_OUTPUT,
    async execute(args) {
      const targetDir = args.projectPath ? path.resolve(args.projectPath) : process.cwd();
      const result = await runPythonEngine(["update-state"], targetDir);
      return `[Webnovel Commit] Đã cập nhật trạng thái sau Chương ${args.chapterNumber}:\n${result}`;
    }
  }));

  // 6. Tool: webnovel_review
  ctx.tools.register(defineTool({
    name: "webnovel_review",
    description: "Chạy kiểm duyệt chương truyện qua bộ lọc chất lượng (nhịp điệu, OOC, phục bút, sảng điểm).",
    parameters: {
      chapterPath: { type: "string", required: true, description: "Đường dẫn file chương cần kiểm duyệt" },
      projectPath: { type: "string", description: "Đường dẫn thư mục dự án" }
    },
    output: TEXT_OUTPUT,
    async execute(args) {
      const targetDir = args.projectPath ? path.resolve(args.projectPath) : process.cwd();
      return await runPythonEngine(["review-pipeline", "--file", args.chapterPath], targetDir);
    }
  }));
}

export { name, inject, apply };
