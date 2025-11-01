import svgPaths from "./svg-uk8bdq5owu";
import imgTexture from "figma:asset/08b93791cd58b9c902e2fa400c490c9f95481605.png";
import img from "figma:asset/e4a40955d23d726ecc4a4d5dc71ff08b3a7c5887.png";

function BackgroundMask() {
  return (
    <div className="absolute contents inset-[1.667%]" data-name="Background Mask">
      <div className="absolute inset-[1.667%]" data-name="Mask">
        <div className="absolute bg-[#7ba589] inset-[3.448%] rounded-[166.5px]" data-name="Background" />
      </div>
      <div className="absolute inset-0 mix-blend-overlay" data-name="Texture">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgTexture} />
      </div>
      <div className="absolute inset-0" data-name="Shading">
        <div className="absolute inset-0 mix-blend-overlay" data-name="Shading" />
      </div>
    </div>
  );
}

function PlaqueStyle() {
  return (
    <div className="absolute inset-0" data-name="Plaque Style">
      <div className="absolute inset-[1.667%] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.5)]" data-name="Background">
        <div className="absolute bg-[#f5dc3f] inset-[3.448%] rounded-[166.5px]" data-name="Background" />
      </div>
      <BackgroundMask />
      <div className="absolute inset-[1.667%]" data-name="Plaque Border">
        <div className="absolute inset-[8.62%] mix-blend-multiply" data-name="Shadow">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <g filter="url(#filter0_i_3_889)" id="Shadow" style={{ mixBlendMode: "multiply" }}>
              <circle cx="16" cy="16" fill="var(--fill-0, white)" r="16" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="32" id="filter0_i_3_889" width="32" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset />
                <feGaussianBlur stdDeviation="0.666667" />
                <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_889" />
              </filter>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-[3.448%]" data-name="Outer Stroke">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
            <g id="Outer Stroke">
              <path clipRule="evenodd" d={svgPaths.p37fae900} fill="var(--fill-0, #F5DC3F)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p37fae900} fill="url(#paint0_linear_3_910)" fillRule="evenodd" style={{ mixBlendMode: "overlay" }} />
            </g>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_910" x1="10.9636" x2="28.9636" y1="4.90909" y2="30.7636">
                <stop />
                <stop offset="0.238205" stopColor="white" />
                <stop offset="0.487259" stopColor="#5F5F5F" />
                <stop offset="0.693417" stopColor="white" />
                <stop offset="1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-[3.45%]" data-name="Outer Stroke Decoration">
          <img alt="" className="block max-w-none size-full" height="36" src={img} width="36" />
        </div>
        <div className="absolute inset-[12.07%_11.59%_11.59%_12.07%] mix-blend-overlay" data-name="Inner Stroke">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
            <g id="Inner Stroke" style={{ mixBlendMode: "overlay" }}>
              <path clipRule="evenodd" d={svgPaths.p2d6fe930} fill="var(--fill-0, #F5DC3F)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p2d6fe930} fill="var(--fill-1, white)" fillOpacity="0.7" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Contents() {
  return (
    <div className="absolute box-border content-stretch flex inset-[31.25%_21.67%] items-center justify-center pl-0 pr-[1.333px] py-0" data-name="Contents">
      <div className="flex flex-col font-['Cinzel:Bold',sans-serif] font-bold justify-center leading-[0] mr-[-1.333px] relative shrink-0 text-[20.667px] text-black text-center text-nowrap tracking-[-0.8267px]">
        <p className="leading-[normal] whitespace-pre">3</p>
      </div>
    </div>
  );
}

export default function VpTile() {
  return (
    <div className="relative size-full" data-name="VP tile">
      <PlaqueStyle />
      <Contents />
    </div>
  );
}