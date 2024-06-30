const fs = require("fs");
const { execSync } = require("child_process");

const folderPath = "D:\\books2";

fs.access(folderPath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
  if (err) {
    console.error(`No access to ${folderPath}: ${err.message}`);
  } else {
    try {
      execSync(
        `python addFolder.py "${folderPath}" "C:\\Users\\vikle\\Documents\\GitHubProjects\\Epub-book-Reader\\books" `,
        {
          maxBuffer: 1024 * 1024 * 10,
        }
      );
      console.log("Python script executed successfully");
    } catch (error) {
      console.error("Error executing script:", error);
    }
  }
});
