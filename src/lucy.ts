import {parser} from '@lucy/lezer-lucy';
import {
  delimitedIndent,
  foldNodeProp,
  foldInside,
  indentNodeProp,
  LezerLanguage,
  LanguageSupport
} from '@codemirror/language';
import {styleTags, tags as t} from '@codemirror/highlight';
import {completeFromList, ifNotIn} from '@codemirror/autocomplete';

let parserWithMetadata = parser.configure({
  props: [
    styleTags({
      'initial final': t.modifier,
      // action and guard declare names; as calls they are functions, below.
      'state machine event input ActionDeclaration/action GuardDeclaration/guard': t.definitionKeyword,
      'use': t.definitionKeyword,

      'Arrow ImmediateArrow': t.punctuation,
      Number: t.number,
      LocalName: t.special(t.variableName),
      String: t.string,
      LineComment: t.lineComment,
      BlockComment: t.blockComment,
      '( )': t.paren,
      '{ }': t.brace,
      
      'invoke': t.keyword,
      'InlineAction/action InlineGuard/guard Delay/delay InlineAssign/assign InlineSpawn/spawn InlineSend/send InlineAppend/append InlineRemove/remove OnEvent/on':
        t.function(t.variableName),
      Symbol: t.atom,
      TypeName: t.typeName,
      // The name of an input a spawn gives, and the key in event.data or context.key.
      PropertyName: t.propertyName
    }),
    indentNodeProp.add({
      'StateBlock InvokeBlock MachineBlock TransitionBlock SpawnBlock UseGroup': delimitedIndent({closing: "}"}),
    }),
    foldNodeProp.add({
      'StateBlock InvokeBlock MachineBlock TransitionBlock SpawnBlock UseGroup': foldInside
    })
  ]
})

export const lucyLanguage = LezerLanguage.define({
  parser: parserWithMetadata,
  languageData: {
    closeBrackets: {brackets: ["(", "{", "'", '"']},
    commentTokens: {line: "//", block: {open: "/*", close: "*/"}}
  }
})

export const lucyCompletion = lucyLanguage.data.of({
  autocomplete: ifNotIn(["LineComment", "BlockComment", "String"], completeFromList([
    {label: "use", type: "keyword"},
    {label: "state", type: "keyword"},
    {label: 'machine', type: 'keyword'},
    {label: 'action', type: 'keyword'},
    {label: 'event', type: 'keyword'},
    {label: 'input', type: 'keyword'},
    {label: 'guard', type: 'function'},
    {label: 'delay', type: 'function'},
    {label: 'assign', type: 'function'},
    {label: 'spawn', type: 'function'},
    {label: 'send', type: 'function'},
    {label: 'append', type: 'function'},
    {label: 'remove', type: 'function'},
    {label: 'invoke', type: 'function'},
    {label: 'on', type: 'function'},
    {label: 'initial', type: 'keyword'},
    {label: 'final', type: 'keyword'}
  ]))
});

export function lucy(): LanguageSupport {
  return new LanguageSupport(lucyLanguage, [lucyCompletion])
}