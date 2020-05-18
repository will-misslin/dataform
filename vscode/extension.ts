// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "dataform" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand("dataform.helloWorld", () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage("Hello World from dataform!");
  });

  let currentPanel: vscode.WebviewPanel | null = null;

  const showSidebar = vscode.commands.registerCommand("dataform.showSidebar", () => {
    // Track current webview panel
    const columnToShowIn = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;
    // // // Create and show a new webview
    if (currentPanel) {
      // If we already have a panel, show it in the target column
      currentPanel.reveal(columnToShowIn);
    } else {
      currentPanel = vscode.window.createWebviewPanel(
        "dataform", // Identifies the type of the webview. Used internally
        "Sidebar", // Title of the panel displayed to the user
        vscode.ViewColumn.Two, // Editor column to show the new webview panel in.,
        {
          enableScripts: true
        }
      );

      currentPanel.webview.html = getWebviewContent();

      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
        },
        null,
        context.subscriptions
      );
    }
  });

  const addThingToPanel = vscode.commands.registerCommand("dataform.addToPanel", () => {
    // Send a message to our webview.
    // You can send any JSON serializable data.
    currentPanel.webview.postMessage({ bodyContent: "SOME BODY CONTENT" });
  });

  context.subscriptions.push(showSidebar, addThingToPanel, disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function getWebviewContent() {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sidebar</title>
    <script>
        ${addToSidebarScript()}
    </script>
  </head>
  <body>
      <h1>Dataform sidebar content</h1>
      <p id="sidebar-body"></p>
  </body>
  </html>`;
}

function addToSidebarScript() {
  return `
  window.addEventListener("message", event => {
    const sidebarBody = document.getElementById("sidebar-body");
    const message = event.data; // The JSON data our extension sent

    if (message.bodyContent) {
      sidebarBody.textContent = message.bodyContent;
    }
  });`;
}
