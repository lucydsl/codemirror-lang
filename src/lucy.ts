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
      'state machine action guard': t.definitionKeyword,
      'use': t.definitionKeyword,

      Arrow: t.punctuation,
      String: t.string,
      LineComment: t.lineComment,
      BlockComment: t.blockComment,
      '( )': t.paren,
      '{ }': t.brace,
      
      'invoke': t.keyword,
      'action guard delay assign spawn send': t.function(t.variableName),
      Symbol: t.atom
    }),
    indentNodeProp.add({
      'StateBlock InvokeBlock MachineBlock': delimitedIndent({closing: "}"}),
      //Application: context => context.column(context.node.from) + context.unit
    }),
    foldNodeProp.add({
      Application: foldInside
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
    {label: 'guard', type: 'function'},
    {label: 'delay', type: 'function'},
    {label: 'assign', type: 'function'},
    {label: 'spawn', type: 'function'},
    {label: 'send', type: 'function'},
    {label: 'invoke', type: 'function'}
  ]))
});

export function lucy(): LanguageSupport {
  return new LanguageSupport(lucyLanguage, [lucyCompletion])
}