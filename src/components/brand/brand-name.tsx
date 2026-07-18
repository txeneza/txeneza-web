import type { HTMLAttributes } from "react";

type BrandNameProps = HTMLAttributes<HTMLSpanElement> & {
  /**
   * "default"  — para usar sobre fundos claros no modo claro e fundos
   *              quase-pretos (grey900) no modo escuro, que é o padrão do
   *              resto do site (ver `bg-background dark:bg-grey900`).
   * "onDark"   — para usar em áreas com fundo escuro FIXO, que não muda
   *              com o tema claro/escuro do site (ex: footer, topo da
   *              hero-section, navbar com scroll). Nestas áreas o fundo é
   *              sempre `forestGreen`/quase-preto, logo "Teneza" precisa de
   *              ficar sempre claro, independentemente do tema ativo.
   */
  variant?: "default" | "onDark";
};

/**
 * Renderiza o nome da marca "Txeneza" com o esquema de cores oficial:
 * - "Teneza" (todas as letras exceto o "x") em `forestGreen` (claro) /
 *   `grey50` (escuro) — ou sempre branco quando `variant="onDark"`.
 * - A letra "x" em `limeGreen` sólido, sempre, em qualquer variante.
 *
 * Nunca deve usar gradiente (bg-gradient-*, bg-clip-text, text-transparent).
 * Qualquer ajuste de tamanho, peso ou espaçamento deve ser feito através do
 * `className` recebido no elemento pai/wrapper, não dentro deste componente.
 */
export function BrandName({ className, variant = "default", ...props }: BrandNameProps) {
  const baseLetterColor =
    variant === "onDark" ? "text-white" : "text-forestGreen dark:text-grey50";

  return (
    <span aria-label="Txeneza" className={className} {...props}>
      <span className={baseLetterColor}>T</span>
      <span className="text-limeGreen">x</span>
      <span className={baseLetterColor}>eneza</span>
    </span>
  );
}
