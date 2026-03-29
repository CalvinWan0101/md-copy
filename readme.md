# Markdown Copy

Markdown Copy adds practical copy actions to VS Code's built-in Markdown workflow.

It covers two common cases:

- Copy the full Markdown source of the current file
- Copy individual code blocks directly from the built-in Markdown preview

## Features

### Copy the whole Markdown file

The extension contributes a `Copy Markdown` command that copies the raw Markdown source of the current file to the clipboard.

You can trigger it from:

- The editor title area while editing a Markdown file
- The Markdown preview toolbar when preview is active
- The Command Palette with `Copy Markdown`

### Copy code blocks from preview

Inside VS Code's built-in Markdown preview, every code block gets a `Copy` button.

Clicking it copies only that code block's content, with trailing blank lines trimmed.

## How To Use

1. Open a Markdown file.
2. Open the built-in Markdown preview.
3. Use the top `Copy` button to copy the full Markdown source.
4. Use a code block's `Copy` button to copy just that snippet.

## Requirements

- VS Code `1.80.0` or newer

## Commands

- `Copy Markdown`

## Limitations

- Copy buttons are injected only into VS Code's built-in Markdown preview.
- Third-party Markdown preview extensions are not modified.

## Development

Install dependencies:

```bash
npm install
```

Compile the extension:

```bash
npm run compile
```

Run TypeScript in watch mode:

```bash
npm run watch
```

Create a VSIX package:

```bash
npm run package
```
