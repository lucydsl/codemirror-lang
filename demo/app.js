import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup";
import {Compartment} from "@codemirror/state"
import {defaultTabBinding} from "@codemirror/commands";
import {keymap} from "@codemirror/view";
import {lucy} from '../lib/lucy.js';

const language = new Compartment();
const tabSize = new Compartment();

const view = new EditorView({
  state: EditorState.create({
    doc: document.querySelector('#src').textContent.trim(),
    extensions: [
      basicSetup,
      keymap.of([defaultTabBinding]),
      language.of(lucy()),
      tabSize.of(EditorState.tabSize.of(2)),
    ]
  }),
  parent: document.querySelector('#app')
});