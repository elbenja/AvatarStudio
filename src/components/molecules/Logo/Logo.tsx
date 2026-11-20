import './Logo.css';

const MARK =
  'M379.148 438.205C401.742 407.479 430.595 386.66 455.386 380.515C458.54 378.786 480.067 379.51 484.816 381.461C515.461 389.265 562.846 412.689 612.281 445.647C661.679 478.476 700.866 512.952 719.091 537.673C722.662 541.212 730.713 560.232 730.063 563.702C732.53 587.991 721.742 620.878 699.074 651.534C676.603 682.33 647.749 703.219 623.069 709.294C619.804 711.023 598.425 710.369 593.676 708.499C562.957 700.543 515.498 677.189 466.064 644.302C416.629 611.345 377.405 576.787 359.143 552.066C355.572 548.514 347.631 529.576 348.282 526.107C345.815 501.888 356.591 469.001 379.148 438.205ZM236.268 439.946C202.175 529.074 189.374 613.004 198.26 666.067C197.843 674.304 215.613 710.52 222.56 715.649C259.427 756.13 335.297 800.806 428.926 833.342C522.518 865.797 610.759 877.936 666.502 869.489C675.228 869.769 713.163 852.934 718.514 846.357C761.125 811.075 808.019 738.933 842.076 649.945C876.145 560.735 888.909 476.805 880.097 423.753C880.478 415.505 862.707 379.218 855.723 374.159C818.721 333.678 743.01 289.003 649.566 256.536C555.974 224.081 467.696 211.943 412.137 220.331C403.252 219.957 365.218 236.886 359.941 243.463C317.293 278.734 270.362 350.735 236.268 439.946Z';

/** Silverdesk Lab lockup. On hover a colour glow blooms behind it and the subtitle swaps for where the link goes. */
export function Logo({ href = 'https://silverdesk.com' }: { href?: string }) {
  return (
    <a className="sd-logo" href={href} target="_blank" rel="noopener" aria-label="Silverdesk Lab, Avatar Studio. Visit silverdesk.com, opens in a new tab">
      <svg className="sd-logo-mark" viewBox="180 200 720 690" aria-hidden="true">
        <path d={MARK} fillRule="evenodd" clipRule="evenodd" fill="currentColor" />
      </svg>
      <span className="sd-logo-text">
        <span className="sd-logo-line">
          <span className="sd-logo-word">Silverdesk</span>
          <span className="sd-logo-lab">Lab</span>
        </span>
        <span className="sd-logo-sub" aria-hidden="true">
          <span className="sd-logo-sub-a">Avatar Studio</span>
          <span className="sd-logo-sub-b">
            silverdesk.com
            <svg viewBox="0 0 12 12" fill="none"><path d="M3.5 8.5 8.5 3.5M4.5 3.5h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </span>
      </span>
    </a>
  );
}
