import { useMemo, useState } from "react";
import Lexer from "../../Lexer";
import Parser from "../../Parser";
import Token from "../../Lexer/Token";

type TokenView = { type: string; value: string };

type AstView = {
  type: string | undefined;
  label: string | null;
  lexme: TokenView | null;
  children: AstView[];
};

type AstRenderMode = "data" | "tree";

const toTokenView = (token: Token): TokenView => ({
  type: token.getType(),
  value: token.getValue(),
});

const toAstView = (node: any): AstView => {
  const lexme = node.getLexeme?.() ?? null;
  const children = node.getChildren?.() ?? [];
  return {
    type: node.getType?.(),
    label: node.getLabel?.() ?? null,
    lexme: lexme ? toTokenView(lexme) : null,
    children: children.map((c: any) => toAstView(c)),
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
  const [code, setCode] = useState<string>("{ IF(1){ } ELSE { } }");
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
