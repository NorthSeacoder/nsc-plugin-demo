// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
// 下划线转换驼峰
function toHump(name) {
	return name.replace(/\_(\w)/g, function (all, letter) {
		return letter.toUpperCase();
	});
}
// 驼峰转换下划线
function toLine(name) {
	return name.replace(/([A-Z])/g, "_$1").toLowerCase();
}
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "plugin-demo" is now active!');
	const toogleName = () => {
		let activeTextEditor = vscode.window.activeTextEditor;
		let activeDocument = activeTextEditor.document;

		// 1. 获取所有选中行信息
		let selection = vscode.window.activeTextEditor.selection;
		// 起止行行号
		let startLine = selection.start.line;
		let endLine = selection.end.line;
		// 2. 获取每行的信息（位置、内容）

		let commentArr = [];
		let lineLengthArr = []
		for (let i = startLine; i <= endLine; i++) {
			let curLineText = activeDocument.lineAt(i).text; // 当前行文本内容
			lineLengthArr.push(curLineText.length)
			if (curLineText.includes('_')) {
				curLineText = toHump(curLineText)
			} else {
				curLineText = toLine(curLineText)
			}
			commentArr.push(curLineText)
		}
		let replaceRange = new vscode.Range(startLine, 0, endLine, lineLengthArr[lineLengthArr.length - 1]);
		try {
			activeTextEditor.edit((TextEditorEdit) => {
				TextEditorEdit.replace(replaceRange, commentArr.join('\n'));
			});
		} catch (error) {
			// console.log(error)
		}

	}



	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.toogle', toogleName);

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}