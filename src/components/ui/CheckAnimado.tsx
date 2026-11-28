import styles from "./CheckAnimado.module.css";

interface CheckAnimadoProps {
  /** Tamanho em px. */
  tamanho?: number;
  /** "claro": sobre fundo colorido. "verde": sobre fundo branco. */
  variante?: "claro" | "verde";
  className?: string;
}

/**
 * Check de sucesso animado em loop: o círculo e o check se desenham,
 * um anel pulsa em volta e o ciclo recomeça. Com "reduzir movimento"
 * ativado no sistema, aparece já desenhado e parado.
 */
export const CheckAnimado = ({
  tamanho = 120,
  variante = "verde",
  className = "",
}: CheckAnimadoProps) => (
  <div
    className={`${styles.raiz} ${styles[variante]} ${className}`}
    style={{ width: tamanho, height: tamanho }}
    role="img"
    aria-label="Pedido recebido"
  >
    <span className={styles.anel} />
    <span className={`${styles.anel} ${styles.anelAtrasado}`} />
    <svg viewBox="0 0 52 52" className={styles.svg}>
      <circle className={styles.fundo} cx="26" cy="26" r="24" />
      <circle className={styles.circulo} cx="26" cy="26" r="24" />
      <path className={styles.check} d="M15 27 l7 7 l15 -16" />
    </svg>
  </div>
);
