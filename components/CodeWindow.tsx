type Token = [text: string, color?: string];

const C = {
  key: "text-[#c792ea]",
  type: "text-[#57db96]",
  fn: "text-[#82aaff]",
  str: "text-[#d6995c]",
  dim: "text-white/35",
  prop: "text-[#89ddff]",
};

const LINES: Token[][] = [
  [
    ["import", C.key],
    [" { Injectable } ", ""],
    ["from", C.key],
    [' "@nestjs/common"', C.str],
    [";", C.dim],
  ],
  [
    ["import", C.key],
    [" { InjectModel } ", ""],
    ["from", C.key],
    [' "@nestjs/mongoose"', C.str],
    [";", C.dim],
  ],
  [],
  [
    ["@Injectable", C.fn],
    ["()", C.dim],
  ],
  [
    ["export class ", C.key],
    ["OrdersService", C.type],
    [" {", C.dim],
  ],
  [
    ["  constructor", C.key],
    ["(", C.dim],
  ],
  [
    ["    @InjectModel", C.fn],
    ["(Order.name) ", C.dim],
    ["private ", C.key],
    ["orders", C.prop],
    [": ", C.dim],
    ["Model", C.type],
    ["<Order>", C.dim],
    [",", C.dim],
  ],
  [
    ["    private ", C.key],
    ["payments", C.prop],
    [": ", C.dim],
    ["PaymentGateway", C.type],
    [",", C.dim],
  ],
  [["  ) {}", C.dim]],
  [],
  [
    ["  async ", C.key],
    ["place", C.fn],
    ["(dto: ", C.dim],
    ["PlaceOrderDto", C.type],
    [") {", C.dim],
  ],
  [
    ["    const ", C.key],
    ["menu", C.prop],
    [" = ", C.dim],
    ["await ", C.key],
    ["this", C.key],
    [".menu.", C.dim],
    ["livePrices", C.fn],
    ["()", C.dim],
    [";", C.dim],
  ],
  [
    ["    const ", C.key],
    ["order", C.prop],
    [" = ", C.dim],
    ["await ", C.key],
    ["this", C.key],
    [".orders.", C.dim],
    ["create", C.fn],
    ["({", C.dim],
  ],
  [
    ["      ...dto, ", ""],
    ["total", C.prop],
    [": ", C.dim],
    ["priceOf", C.fn],
    ["(dto.items, menu),", C.dim],
  ],
  [
    ["      status", C.prop],
    [": ", C.dim],
    ['"new"', C.str],
    [",", C.dim],
  ],
  [["    });", C.dim]],
  [
    ["    this", C.key],
    [".events.", C.dim],
    ["emit", C.fn],
    ["(", C.dim],
    ['"order.placed"', C.str],
    [", order);", C.dim],
  ],
  [
    ["    return ", C.key],
    ["order", C.prop],
    [";", C.dim],
  ],
  [["  }", C.dim]],
  [["}", C.dim]],
];

const TABS = ["orders.service.ts", "menu.controller.ts", "site.config.json"];

export default function CodeWindow({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <div className="w-136 origin-top-left transform-[rotateX(50deg)_rotateZ(-38deg)] transform-3d">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#141128] font-mono text-[13px] leading-[1.7] shadow-[1px_1px_0_#1d1838,2px_2px_0_#1d1838,3px_3px_0_#1a1533,4px_4px_0_#1a1533,5px_5px_0_#17122e,6px_6px_0_#17122e,7px_7px_0_#140f29,8px_8px_0_#140f29,30px_40px_60px_rgba(3,4,18,0.8)]">
          <div className="flex items-center border-b border-white/5 bg-[#100d22]">
            <div className="flex gap-1.5 px-4">
              <span className="size-2.5 rounded-full border border-white/30" />
              <span className="size-2.5 rounded-full border border-white/30" />
              <span className="size-2.5 rounded-full border border-white/30" />
            </div>
            {TABS.map((tab, i) => (
              <span
                key={tab}
                className={`border-r border-white/5 px-4 py-2 text-xs ${i === 0 ? "bg-[#141128] text-white" : "text-white/40"}`}
              >
                {tab}
              </span>
            ))}
          </div>
          <div className="flex py-3">
            <div className="w-10 shrink-0 pr-3 text-right text-white/20 tabular-nums">
              {LINES.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <div className="min-w-0 flex-1 overflow-hidden whitespace-pre text-white/85">
              {LINES.map((line, i) => (
                <div
                  key={i}
                  className={
                    i === 11 ? "-mx-2 rounded bg-lavender/15 px-2" : undefined
                  }
                >
                  {line.length
                    ? line.map(([t, c], j) => (
                        <span key={j} className={c}>
                          {t}
                        </span>
                      ))
                    : " "}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-5 border-t border-white/5 bg-[#100d22] px-4 py-1.5 text-[11px] text-white/40">
            <span>TypeScript</span>
            <span>UTF-8</span>
            <span>Ln 12, Col 34</span>
            <span className="text-mint">● main</span>
          </div>
        </div>
      </div>
    </div>
  );
}
