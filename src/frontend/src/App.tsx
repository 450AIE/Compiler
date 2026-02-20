import { useMemo, useState } from "react";
import Lexer from "../../Lexer";
import Parser from "../../Parser";
import Token from "../../Lexer/Token";

type TokenView = { type: string; value: string; loc?: any };

type AstView = {
  type: string | undefined;
  label: string | null;
  lexme: TokenView | null;
  children: AstView[];
};

type AstRenderMode = "data" | "tree";

const toTokenView = (token: any): TokenView => {
  if (!token) return { type: "UNKNOWN", value: "null" };
  if (typeof token.getType === "function" && typeof token.getValue === "function") {
    const loc = typeof token.getLoc === "function" ? token.getLoc() : token.loc;
    return { type: token.getType(), value: token.getValue(), loc };
  }
  if (typeof token.type === "string" && typeof token.value === "string") {
    return { type: token.type, value: token.value, loc: token.loc };
  }
  return { type: "UNKNOWN", value: String(token) };
};

const toAstView = (node: any): AstView => {
  if (!node) {
    return { type: "NULL", label: null, lexme: null, children: [] };
  }
  const lexme = node.getLexeme?.() ?? node.getLexme?.() ?? null;
  const directChildren = node.getChildren?.() ?? node.children ?? [];
  const bodyChildren = node.body ?? [];
  const children =
    Array.isArray(directChildren) && directChildren.length > 0
      ? directChildren
      : Array.isArray(bodyChildren)
      ? bodyChildren
      : [];
  return {
    type: node.getType?.(),
    label: node.getLabel?.() ?? null,
    lexme: lexme ? toTokenView(lexme) : null,
    children: (Array.isArray(children) ? children : []).map((c: any) => toAstView(c)),
  };
};

function AstTreeNode({ node }: { node: AstView }) {
  const titleParts = [
    node.type ?? "UNKNOWN",
    node.label ? `label=${node.label}` : null,
    node.lexme ? `lexme=${node.lexme.value}` : null,
  ].filter(Boolean);

  return (
    <li className="treeItem">
      <div className="treeLabel">{titleParts.join(" ")}</div>
      {node.children.length > 0 ? (
        <ul className="treeList">
          {node.children.map((c, idx) => (
            <AstTreeNode key={`${c.type ?? "node"}-${idx}`} node={c} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function App() {
  const [code, setCode] = useState<string>(`function get(a,b,c,d){
  const x = (a + b) * (c + d)
  let i = 2
  const arr = [1,2,3,{ name : 'White Album 2' }]
  const Obj = {
    son:{
      name: '陈熙阳'
    },
    sonSon:{
      name: '雷超'
    },
    sonSonSon:{
      name: '龙旭',
      info:{
        sex: '未知'
      }
    }
  }
  while(i < 3){
    if(i == 1){
      let y = x + i * 2
    } else {
      let y = x - i
    }
    i = i + 1
  }
  for(let b = 1; b == 10; b = b + 1) {
    const a = 1 + 1
  }
  return x
}`);
  const [astMode, setAstMode] = useState<AstRenderMode>("data");

  const { tokensText, astText, astTree } = useMemo(() => {
    try {
      const tokens = Lexer.parse(code) as Token[];
      const tokenViews = tokens.map(toTokenView);
      const ast = Parser.parse(tokens);
      const astView = toAstView(ast);
      return {
        tokensText: JSON.stringify(tokenViews, null, 2),
        astText: JSON.stringify(astView, null, 2),
        astTree: astView,
      };
    } catch (e: any) {
      const message = e?.message ?? String(e);
      return {
        tokensText: `Error: ${message}`,
        astText: `Error: ${message}`,
        astTree: null,
      };
    }
  }, [code]);

  return (
    <div className="page">
      <div className="left">
        <textarea
          className="editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          placeholder="Write code here"
        />
      </div>
      <div className="right">
        <div className="panel">
          <div className="panelTitle">词法分析结果</div>
          <pre className="panelBody">{tokensText}</pre>
        </div>
        <div className="panel">
          <div className="panelHeader">
            <div className="panelTitle">语法分析结果</div>
            <div className="panelActions">
              <button
                className={`toggleButton ${astMode === "data" ? "active" : ""}`}
                onClick={() => setAstMode("data")}
                type="button"
              >
                展示数据
              </button>
              <button
                className={`toggleButton ${astMode === "tree" ? "active" : ""}`}
                onClick={() => setAstMode("tree")}
                type="button"
              >
                展示树状
              </button>
            </div>
          </div>
          {astMode === "data" ? (
            <pre className="panelBody">{astText}</pre>
          ) : (
            <div className="panelBody treeBody">
              {astTree ? (
                <ul className="treeList rootTree">
                  <AstTreeNode node={astTree} />
                </ul>
              ) : (
                <pre className="treeError">{astText}</pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
