import type { HTMLAttributes } from "react";

type BrandNameProps = HTMLAttributes<HTMLSpanElement>;

/**
 * Renderiza o nome da marca "Txeneza" com o esquema de cores oficial:
 * - "Teneza" (todas as letras exceto o "x") em `forestGreen` sólido.
 * - A letra "x" em `limeGreen` sólido.
 *
 * Nunca deve usar gradiente (bg-gradient-*, bg-clip-text, text-transparent).
 * Qualquer ajuste de tamanho, peso ou espaçamento deve ser feito através do
 * `className` recebido no elemento pai/wrapper, não dentro deste componente.
 */
export function BrandName({ className, ...props }: BrandNameProps) {
  return (
    <span aria-label="Txeneza" className={className} {...props}>
      <span className="text-forestGreen">T</span>
      <span className="text-limeGreen">x</span>
      <span className="text-forestGreen">eneza</span>
    </span>
  );
}
