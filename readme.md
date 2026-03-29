# Markdown Copy

Markdown Copy adds copy actions to VS Code's built-in Markdown preview.

It supports two common cases:

- Copy the entire Markdown source of the current file
- Copy the content of individual code blocks directly from the preview

## Features

### Copy the full Markdown document

When you open a Markdown file, the extension contributes a `Copy Markdown` command.

You can run it from:

- The editor title area while editing a Markdown file
- The Markdown preview toolbar area when preview is active
- Command Palette via `Markdown Copy: Copy Markdown`

The command copies the raw Markdown source to the clipboard.

### Copy individual code blocks in preview

Inside the built-in Markdown preview, each code block gets a `Copy` button.

Clicking that button copies only the code block content, with trailing blank lines trimmed.

## Requirements

- VS Code `1.80.0` or newer

No extra setup is required.

## Usage

1. Open any `.md` file in VS Code.
2. Open Markdown preview.
3. Use the top `Copy` button to copy the whole Markdown file.
4. Use the `Copy` button on a code block to copy just that block.

## Extension Settings

This extension currently does not add any custom settings.

## Known Limitations

- Copy buttons are added only to VS Code's built-in Markdown preview.
- Other Markdown renderers or third-party preview extensions are not modified.

## Development

Install dependencies:

```bash
npm install
```

Compile:

```bash
npm run compile
```

Watch mode:

```bash
npm run watch
```

Package the extension:

```bash
npm run package
```

## Release Notes

### 0.0.1

- Initial release
- Added copy support for full Markdown documents
- Added copy buttons for code blocks in Markdown preview