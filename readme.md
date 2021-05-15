# @lucy/codemirror-lang

This package implements Lucy language support for [CodeMirror 6](https://codemirror.net/6).

## Usage

Language extensions are used with an EditorState object like so:

```js
import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup";
import {Compartment} from "@codemirror/state"
import {defaultTabBinding} from "@codemirror/commands";
import {keymap} from "@codemirror/view";
import {lucy} from '@lucy/codemirror-lang';

const language = new Compartment();
const tabSize = new Compartment();

const lucySrc = `
state idle {
  start => guard(:loggedIn) => downloading
}

state downloading {

}
`;

const view = new EditorView({
  state: EditorState.create({
    doc: lucySrc.trim(),
    extensions: [
      basicSetup,
      keymap.of([defaultTabBinding]),
      language.of(lucy()),
      tabSize.of(EditorState.tabSize.of(2)),
    ]
  }),
  parent: document.querySelector('#app')
});
```

## License

BSD-2-Clause