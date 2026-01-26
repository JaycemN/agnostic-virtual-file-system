import { ConstrainedFS } from "./domain/def/constrained-file-system.js";
import { MemoryFS } from "./domain/def/memory-file-system.js";

async function main() {
  const constrainedfs = new ConstrainedFS("/home/linux_cat/Documents");
  console.log(
    await constrainedfs.fileRead(
      "cv/Essam_Qutqut_FrontEnd_Engineer_CV_tobemodified.docx",
    ),
  );
}

await main();
