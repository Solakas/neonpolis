import svgPaths from "./svg-lktk6dhuj2";
import imgBg from "figma:asset/aae46d0917e4675be89f926861a71b369bd26f95.png";
import img from "figma:asset/b0f397bb8e6ffd82d5c040d7af93c79e81a98946.png";
import img1 from "figma:asset/da96cdeac20dd4e007079a284d88a667962046af.png";
import img3 from "figma:asset/7650acb3c38ea70d8a0e39ea56457dcc67fe5604.png";
import img4 from "figma:asset/08b93791cd58b9c902e2fa400c490c9f95481605.png";
import img5 from "figma:asset/58eca402af7d4ee9ae623c8f927619224e57277f.png";
import img6 from "figma:asset/b7c0dd0d26a4dc11e0f79374bb927b5178926a93.png";
import img7 from "figma:asset/26d306a2b55de3e1f835dc319ac3d24fecce49f9.png";
import img8 from "figma:asset/e4a40955d23d726ecc4a4d5dc71ff08b3a7c5887.png";
import imgGameView from "figma:asset/b846c94630162592b46129a3d823bb962ef9519a.png";
import { img2 } from "./svg-x9b2l";

function Bg() {
  return (
    <div className="absolute h-[561px] left-[44px] rounded-[16px] top-[40px] w-[1352px]" data-name="bg">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[16px] size-full" src={imgBg} />
        <div className="absolute bg-[rgba(0,0,0,0.2)] inset-0 rounded-[16px]" />
      </div>
    </div>
  );
}

function Card01() {
  return (
    <div className="h-[80px] relative rounded-[16px] shrink-0 w-full" data-name="Card 01">
      <div aria-hidden="true" className="absolute border border-[#00e5ff] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[80px] items-center justify-center px-[24px] py-[8px] relative w-full">
          <p className="font-['Fira_Sans:Black',sans-serif] leading-[1.224] not-italic relative shrink-0 text-[#00e5ff] text-[24px] text-nowrap whitespace-pre">Shop Card</p>
        </div>
      </div>
    </div>
  );
}

function Card02() {
  return (
    <div className="h-[80px] relative rounded-[16px] shrink-0 w-full" data-name="Card 02">
      <div aria-hidden="true" className="absolute border border-[#00e5ff] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[80px] items-center justify-center px-[24px] py-[8px] relative w-full">
          <p className="font-['Fira_Sans:Black',sans-serif] leading-[1.224] not-italic relative shrink-0 text-[#00e5ff] text-[24px] text-nowrap whitespace-pre">Shop Card</p>
        </div>
      </div>
    </div>
  );
}

function Card03() {
  return (
    <div className="h-[80px] relative rounded-[16px] shrink-0 w-full" data-name="Card 03">
      <div aria-hidden="true" className="absolute border border-[#00e5ff] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[80px] items-center justify-center px-[24px] py-[8px] relative w-full">
          <p className="font-['Fira_Sans:Black',sans-serif] leading-[1.224] not-italic relative shrink-0 text-[#00e5ff] text-[24px] text-nowrap whitespace-pre">Shop Card</p>
        </div>
      </div>
    </div>
  );
}

function Card04() {
  return (
    <div className="h-[80px] relative rounded-[16px] shrink-0 w-full" data-name="Card 04">
      <div aria-hidden="true" className="absolute border border-[#ff6b2c] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[80px] items-center justify-center px-[24px] py-[8px] relative w-full">
          <p className="font-['Fira_Sans:Black',sans-serif] leading-[1.224] not-italic relative shrink-0 text-[#ff6b2c] text-[24px] text-nowrap whitespace-pre">Discard</p>
        </div>
      </div>
    </div>
  );
}

function Card05() {
  return (
    <div className="h-[80px] relative rounded-[16px] shrink-0 w-full" data-name="Card 05">
      <div aria-hidden="true" className="absolute border border-[#00b3c8] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[80px] items-center justify-center px-[24px] py-[8px] relative w-full">
          <p className="font-['Fira_Sans:Black',sans-serif] leading-[1.224] not-italic relative shrink-0 text-[#00b3c8] text-[24px] text-nowrap whitespace-pre">Deck</p>
        </div>
      </div>
    </div>
  );
}

function CardsListContainer() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[69px] top-[78px] w-[179px]" data-name="Cards List Container">
      <Card01 />
      <Card02 />
      <Card03 />
      <Card04 />
      <Card05 />
    </div>
  );
}

function PlayersPositions() {
  return (
    <div className="absolute h-[328px] left-[380px] top-[112px] w-[594px]" data-name="Players Positions">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 594 328">
        <g id="Players Positions">
          <circle cx="460" cy="194" fill="var(--fill-0, #D9D9D9)" fillOpacity="0.2" id="Ellipse 1" r="133" stroke="var(--stroke-0, #00E5FF)" strokeWidth="2" />
          <circle cx="134" cy="134" fill="var(--fill-0, #D9D9D9)" fillOpacity="0.2" id="Ellipse 2" r="133" stroke="var(--stroke-0, #D94A1E)" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[8px] items-center justify-center left-[1237px] p-[8px] rounded-[100px] size-[44px] top-[534px]">
      <div aria-hidden="true" className="absolute border border-[#00b3c8] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="font-['Fira_Sans:Bold',sans-serif] leading-[1.224] not-italic relative shrink-0 text-[#00b3c8] text-[24px] text-nowrap whitespace-pre">1</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[8px] items-center justify-center left-[1281px] p-[8px] rounded-[100px] size-[44px] top-[490px]">
      <div aria-hidden="true" className="absolute border border-[#00b3c8] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="font-['Fira_Sans:Bold',sans-serif] leading-[1.224] not-italic relative shrink-0 text-[#00b3c8] text-[24px] text-nowrap whitespace-pre">2</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[8px] items-center justify-center left-[1238px] p-[8px] rounded-[100px] size-[44px] top-[446px]">
      <div aria-hidden="true" className="absolute border border-[#00b3c8] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="font-['Fira_Sans:Bold',sans-serif] leading-[1.224] not-italic relative shrink-0 text-[#00b3c8] text-[24px] text-nowrap whitespace-pre">3</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[8px] items-center justify-center left-[1281px] p-[8px] rounded-[100px] size-[44px] top-[392px]">
      <div aria-hidden="true" className="absolute border border-[#00e5ff] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="font-['Fira_Sans:Bold',sans-serif] leading-[1.224] not-italic relative shrink-0 text-[#00e5ff] text-[24px] text-nowrap whitespace-pre">4</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[8px] items-center justify-center left-[1237px] p-[8px] rounded-[100px] size-[44px] top-[348px]">
      <div aria-hidden="true" className="absolute border border-[#00e5ff] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="font-['Fira_Sans:Bold',sans-serif] leading-[1.224] not-italic relative shrink-0 text-[#00e5ff] text-[24px] text-nowrap whitespace-pre">5</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[8px] items-center justify-center left-[1281px] p-[8px] rounded-[100px] size-[44px] top-[304px]">
      <div aria-hidden="true" className="absolute border border-[#00e5ff] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="font-['Fira_Sans:Bold',sans-serif] leading-[1.224] not-italic relative shrink-0 text-[#00e5ff] text-[24px] text-nowrap whitespace-pre">6</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[8px] items-center justify-center left-[1237px] p-[8px] rounded-[100px] size-[44px] top-[260px]">
      <div aria-hidden="true" className="absolute border border-[#ff6b2c] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="font-['Fira_Sans:Bold',sans-serif] leading-[1.224] not-italic relative shrink-0 text-[#ff6b2c] text-[24px] text-nowrap whitespace-pre">7</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[8px] items-center justify-center left-[1281px] p-[8px] rounded-[100px] size-[44px] top-[216px]">
      <div aria-hidden="true" className="absolute border border-[#ff6b2c] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="font-['Fira_Sans:Bold',sans-serif] leading-[1.224] not-italic relative shrink-0 text-[#ff6b2c] text-[24px] text-nowrap whitespace-pre">8</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[8px] items-center justify-center left-[1237px] p-[8px] rounded-[100px] size-[44px] top-[172px]">
      <div aria-hidden="true" className="absolute border border-[#ff6b2c] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="font-['Fira_Sans:Bold',sans-serif] leading-[1.224] not-italic relative shrink-0 text-[#ff6b2c] text-[24px] text-nowrap whitespace-pre">9</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[8px] items-center justify-center left-[1281px] p-[8px] rounded-[100px] size-[44px] top-[118px]">
      <div aria-hidden="true" className="absolute border border-[#d94a1e] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="font-['Fira_Sans:Bold',sans-serif] leading-[1.224] not-italic relative shrink-0 text-[#d94a1e] text-[24px] text-nowrap whitespace-pre">10</p>
    </div>
  );
}

function VictoryRoad() {
  return (
    <div className="absolute contents left-[1205px] top-[70px]" data-name="Victory Road">
      <Frame2 />
      <Frame3 />
      <Frame4 />
      <Frame5 />
      <Frame6 />
      <Frame7 />
      <Frame8 />
      <Frame9 />
      <Frame10 />
      <Frame11 />
      <p className="absolute font-['Fira_Sans:Black',sans-serif] leading-[1.224] left-[1205px] not-italic text-[#ff6b2c] text-[24px] text-nowrap top-[70px] whitespace-pre">Victory Road</p>
    </div>
  );
}

function MainBoard() {
  return (
    <div className="absolute contents left-[44px] top-[40px]" data-name="Main Board">
      <Bg />
      <CardsListContainer />
      <PlayersPositions />
      <VictoryRoad />
    </div>
  );
}

function CharacterImage() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[156px] items-start relative rounded-[16px] shrink-0 w-full" data-name="Character Image">
      <img alt="" className="absolute inset-0 max-w-none mix-blend-screen object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={img} />
      <div className="basis-0 grow min-h-px min-w-px relative rounded-[16px] shrink-0 w-full" data-name="Image">
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={img1} />
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-full" />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start leading-[0] min-h-px min-w-px relative shrink-0 z-[2]" data-name="Text">
      <div className="flex flex-col font-['Fira_Sans:Medium',sans-serif] justify-center not-italic relative shrink-0 text-[#00e5ff] text-[16px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">Nimbus Gibbon</p>
      </div>
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center min-w-full relative shrink-0 text-[12px] text-white w-[min-content]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[16px]">Ascend, if you dare</p>
      </div>
    </div>
  );
}

function BackgroundMask() {
  return (
    <div className="absolute contents inset-[1.667%]" data-name="Background Mask">
      <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[32px_32px] mix-blend-hard-light" data-name="Texture" style={{ maskImage: `url('${img2}')` }}>
        <div className="absolute inset-0 mix-blend-overlay" data-name="Texture">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img3} />
        </div>
      </div>
      <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[32px_32px]" data-name="Shading" style={{ maskImage: `url('${img2}')` }}>
        <div className="absolute inset-0 mix-blend-multiply" data-name="Shading" />
      </div>
    </div>
  );
}

function PlaqueStyle() {
  return (
    <div className="absolute inset-0" data-name="Plaque Style">
      <div className="absolute inset-[1.667%] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.5)]" data-name="Background">
        <div className="absolute inset-[-1.724%]" data-name="Background">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="var(--fill-0, #00B3C8)" id="Background" />
          </svg>
        </div>
      </div>
      <BackgroundMask />
      <div className="absolute inset-[1.667%]" data-name="Plaque Border">
        <div className="absolute inset-0" data-name="Shadow">
          <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
              <g filter="url(#filter0_i_3_930)" id="Shadow">
                <path d={svgPaths.pbcded80} fill="var(--fill-0, white)" style={{ mixBlendMode: "multiply" }} />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="30.9333" id="filter0_i_3_930" width="26.7891" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2.25333" />
                  <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0" />
                  <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_930" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
        <div className="absolute inset-[2.59%_8.62%]" data-name="Bevel">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 30">
            <g id="Bevel">
              <path clipRule="evenodd" d={svgPaths.p3d23f590} fill="var(--fill-0, #00B3C8)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p3d23f590} fill="var(--fill-1, black)" fillOpacity="0.4" fillRule="evenodd" />
            </g>
          </svg>
        </div>
        <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" data-name="Outer Stroke">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
            <path clipRule="evenodd" d={svgPaths.p18026100} fill="var(--fill-0, #00B3C8)" fillRule="evenodd" id="Outer Stroke" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" data-name="Outer Stroke Decoration">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
            <path clipRule="evenodd" d={svgPaths.p18026100} fill="url(#paint0_linear_3_920)" fillOpacity="0.2" fillRule="evenodd" id="Outer Stroke Decoration" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_920" x1="13.7945" x2="12.7279" y1="1.86667" y2="1.86667">
                <stop offset="0.331731" />
                <stop offset="0.341346" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-[10.35%_15.2%_9.65%_15.52%] mix-blend-overlay" data-name="Inner Stroke">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 25">
            <g id="Inner Stroke" style={{ mixBlendMode: "overlay" }}>
              <path clipRule="evenodd" d={svgPaths.p8db7f00} fill="var(--fill-0, #00B3C8)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p8db7f00} fill="var(--fill-1, white)" fillOpacity="0.7" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Contents() {
  return (
    <div className="absolute box-border content-stretch flex inset-[31.25%_21.67%] items-center justify-center pl-[2.667px] pr-0 py-0" data-name="Contents">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-center text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[16px] whitespace-pre">9</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[12px]" data-name="Icon">
        <div className="absolute inset-[7.42%_28.71%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 11">
            <path d={svgPaths.p196f6d00} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function EnergyTile() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Energy Tile">
      <PlaqueStyle />
      <Contents />
    </div>
  );
}

function BackgroundMask1() {
  return (
    <div className="absolute contents inset-[1.667%]" data-name="Background Mask">
      <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[32px_32px] mix-blend-hard-light" data-name="Texture" style={{ maskImage: `url('${img2}')` }}>
        <div className="absolute inset-0 mix-blend-overlay" data-name="Texture">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img3} />
        </div>
      </div>
      <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[32px_32px]" data-name="Shading" style={{ maskImage: `url('${img2}')` }}>
        <div className="absolute inset-0 mix-blend-multiply" data-name="Shading" />
      </div>
    </div>
  );
}

function PlaqueStyle1() {
  return (
    <div className="absolute inset-0" data-name="Plaque Style">
      <div className="absolute inset-[1.667%] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.5)]" data-name="Background">
        <div className="absolute inset-[-1.724%]" data-name="Background">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="var(--fill-0, #D94A1E)" id="Background" />
          </svg>
        </div>
      </div>
      <BackgroundMask1 />
      <div className="absolute inset-[1.667%]" data-name="Plaque Border">
        <div className="absolute inset-0" data-name="Shadow">
          <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
              <g filter="url(#filter0_i_3_930)" id="Shadow">
                <path d={svgPaths.pbcded80} fill="var(--fill-0, white)" style={{ mixBlendMode: "multiply" }} />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="30.9333" id="filter0_i_3_930" width="26.7891" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2.25333" />
                  <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0" />
                  <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_930" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
        <div className="absolute inset-[2.59%_8.62%]" data-name="Bevel">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 30">
            <g id="Bevel">
              <path clipRule="evenodd" d={svgPaths.p3d23f590} fill="var(--fill-0, #D94A1E)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p3d23f590} fill="var(--fill-1, black)" fillOpacity="0.4" fillRule="evenodd" />
            </g>
          </svg>
        </div>
        <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" data-name="Outer Stroke">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
            <path clipRule="evenodd" d={svgPaths.p18026100} fill="var(--fill-0, #D94A1E)" fillRule="evenodd" id="Outer Stroke" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" data-name="Outer Stroke Decoration">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
            <path clipRule="evenodd" d={svgPaths.p18026100} fill="url(#paint0_linear_3_920)" fillOpacity="0.2" fillRule="evenodd" id="Outer Stroke Decoration" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_920" x1="13.7945" x2="12.7279" y1="1.86667" y2="1.86667">
                <stop offset="0.331731" />
                <stop offset="0.341346" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-[10.35%_15.2%_9.65%_15.52%] mix-blend-overlay" data-name="Inner Stroke">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 25">
            <g id="Inner Stroke" style={{ mixBlendMode: "overlay" }}>
              <path clipRule="evenodd" d={svgPaths.p8db7f00} fill="var(--fill-0, #D94A1E)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p8db7f00} fill="var(--fill-1, white)" fillOpacity="0.7" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Contents1() {
  return (
    <div className="absolute box-border content-stretch flex inset-[31.25%_21.67%] items-center justify-center pl-[2.667px] pr-0 py-0" data-name="Contents">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-center text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[16px] whitespace-pre">10</p>
      </div>
      <div className="relative shrink-0 size-[12px]" data-name="Icon">
        <div className="absolute inset-[22.5%_21.67%_20.83%_21.67%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
            <path d={svgPaths.p37257ff0} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function LifeTile() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Life Tile">
      <PlaqueStyle1 />
      <Contents1 />
    </div>
  );
}

function ListContainer() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0 z-[1]" data-name="List container">
      <EnergyTile />
      <LifeTile />
    </div>
  );
}

function Name() {
  return (
    <div className="bg-[rgba(51,51,51,0.4)] relative rounded-[8px] shrink-0 w-full" data-name="Name">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[4px] isolate items-center px-[16px] py-[8px] relative w-full">
          <Text />
          <ListContainer />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#00e5ff] border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
    </div>
  );
}

function TextAutolayout() {
  return (
    <div className="content-stretch flex flex-col gap-[8.477px] items-start relative shrink-0 w-full" data-name="Text Autolayout">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#1a1b25] text-[12px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Once per round, after your final roll, change one kept die to match another kept die face.
      </p>
    </div>
  );
}

function Abilities() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[8px] shrink-0 w-full" data-name="Abilities" style={{ backgroundImage: "linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.8) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.35) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.15) 100%)" }}>
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start px-[8px] py-[16px] relative size-full">
          <TextAutolayout />
        </div>
      </div>
    </div>
  );
}

function BackgroundMask2() {
  return (
    <div className="absolute contents inset-[1.667%]" data-name="Background Mask">
      <div className="absolute inset-[1.667%]" data-name="Mask">
        <div className="absolute bg-[#7ba589] inset-[3.448%] rounded-[166.5px]" data-name="Background" />
      </div>
      <div className="absolute inset-0 mix-blend-overlay" data-name="Texture">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img4} />
      </div>
      <div className="absolute inset-0" data-name="Shading">
        <div className="absolute inset-0 mix-blend-overlay" data-name="Shading" />
      </div>
    </div>
  );
}

function Contents2() {
  return (
    <div className="absolute box-border content-stretch flex inset-[31.25%_21.67%] items-center justify-center pl-0 pr-[1.333px] py-0" data-name="Contents">
      <div className="flex flex-col font-['Cinzel:Bold',sans-serif] font-bold justify-center leading-[0] mr-[-1.333px] relative shrink-0 text-[20.67px] text-black text-center text-nowrap tracking-[-0.8268px]">
        <p className="leading-[normal] whitespace-pre">3</p>
      </div>
    </div>
  );
}

function CharacterImage1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[156px] items-start relative rounded-[16px] shrink-0 w-full" data-name="Character Image">
      <img alt="" className="absolute inset-0 max-w-none mix-blend-screen object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={img} />
      <div className="basis-0 grow min-h-px min-w-px relative rounded-[16px] shrink-0 w-full" data-name="Image">
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={img5} />
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-full" />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start leading-[0] min-h-px min-w-px relative shrink-0 z-[2]" data-name="Text">
      <div className="flex flex-col font-['Fira_Sans:Medium',sans-serif] justify-center not-italic relative shrink-0 text-[#00e5ff] text-[16px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">Basalt Colossus</p>
      </div>
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center min-w-full relative shrink-0 text-[12px] text-white w-[min-content]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[16px]">Flow. Charge. Strike</p>
      </div>
    </div>
  );
}

function BackgroundMask3() {
  return (
    <div className="absolute contents inset-[1.667%]" data-name="Background Mask">
      <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[32px_32px] mix-blend-hard-light" data-name="Texture" style={{ maskImage: `url('${img2}')` }}>
        <div className="absolute inset-0 mix-blend-overlay" data-name="Texture">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img3} />
        </div>
      </div>
      <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[32px_32px]" data-name="Shading" style={{ maskImage: `url('${img2}')` }}>
        <div className="absolute inset-0 mix-blend-multiply" data-name="Shading" />
      </div>
    </div>
  );
}

function PlaqueStyle2() {
  return (
    <div className="absolute inset-0" data-name="Plaque Style">
      <div className="absolute inset-[1.667%] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.5)]" data-name="Background">
        <div className="absolute inset-[-1.724%]" data-name="Background">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="var(--fill-0, #00B3C8)" id="Background" />
          </svg>
        </div>
      </div>
      <BackgroundMask3 />
      <div className="absolute inset-[1.667%]" data-name="Plaque Border">
        <div className="absolute inset-0" data-name="Shadow">
          <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
              <g filter="url(#filter0_i_3_930)" id="Shadow">
                <path d={svgPaths.pbcded80} fill="var(--fill-0, white)" style={{ mixBlendMode: "multiply" }} />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="30.9333" id="filter0_i_3_930" width="26.7891" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2.25333" />
                  <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0" />
                  <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_930" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
        <div className="absolute inset-[2.59%_8.62%]" data-name="Bevel">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 30">
            <g id="Bevel">
              <path clipRule="evenodd" d={svgPaths.p3d23f590} fill="var(--fill-0, #00B3C8)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p3d23f590} fill="var(--fill-1, black)" fillOpacity="0.4" fillRule="evenodd" />
            </g>
          </svg>
        </div>
        <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" data-name="Outer Stroke">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
            <path clipRule="evenodd" d={svgPaths.p18026100} fill="var(--fill-0, #00B3C8)" fillRule="evenodd" id="Outer Stroke" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" data-name="Outer Stroke Decoration">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
            <path clipRule="evenodd" d={svgPaths.p18026100} fill="url(#paint0_linear_3_920)" fillOpacity="0.2" fillRule="evenodd" id="Outer Stroke Decoration" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_920" x1="13.7945" x2="12.7279" y1="1.86667" y2="1.86667">
                <stop offset="0.331731" />
                <stop offset="0.341346" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-[10.35%_15.2%_9.65%_15.52%] mix-blend-overlay" data-name="Inner Stroke">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 25">
            <g id="Inner Stroke" style={{ mixBlendMode: "overlay" }}>
              <path clipRule="evenodd" d={svgPaths.p8db7f00} fill="var(--fill-0, #00B3C8)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p8db7f00} fill="var(--fill-1, white)" fillOpacity="0.7" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Contents3() {
  return (
    <div className="absolute box-border content-stretch flex inset-[31.25%_21.67%] items-center justify-center pl-[2.667px] pr-0 py-0" data-name="Contents">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-center text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[16px] whitespace-pre">9</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[12px]" data-name="Icon">
        <div className="absolute inset-[7.42%_28.71%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 11">
            <path d={svgPaths.p196f6d00} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function EnergyTile1() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Energy Tile">
      <PlaqueStyle2 />
      <Contents3 />
    </div>
  );
}

function BackgroundMask4() {
  return (
    <div className="absolute contents inset-[1.667%]" data-name="Background Mask">
      <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[32px_32px] mix-blend-hard-light" data-name="Texture" style={{ maskImage: `url('${img2}')` }}>
        <div className="absolute inset-0 mix-blend-overlay" data-name="Texture">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img3} />
        </div>
      </div>
      <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[32px_32px]" data-name="Shading" style={{ maskImage: `url('${img2}')` }}>
        <div className="absolute inset-0 mix-blend-multiply" data-name="Shading" />
      </div>
    </div>
  );
}

function PlaqueStyle3() {
  return (
    <div className="absolute inset-0" data-name="Plaque Style">
      <div className="absolute inset-[1.667%] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.5)]" data-name="Background">
        <div className="absolute inset-[-1.724%]" data-name="Background">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="var(--fill-0, #D94A1E)" id="Background" />
          </svg>
        </div>
      </div>
      <BackgroundMask4 />
      <div className="absolute inset-[1.667%]" data-name="Plaque Border">
        <div className="absolute inset-0" data-name="Shadow">
          <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
              <g filter="url(#filter0_i_3_930)" id="Shadow">
                <path d={svgPaths.pbcded80} fill="var(--fill-0, white)" style={{ mixBlendMode: "multiply" }} />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="30.9333" id="filter0_i_3_930" width="26.7891" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2.25333" />
                  <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0" />
                  <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_930" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
        <div className="absolute inset-[2.59%_8.62%]" data-name="Bevel">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 30">
            <g id="Bevel">
              <path clipRule="evenodd" d={svgPaths.p3d23f590} fill="var(--fill-0, #D94A1E)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p3d23f590} fill="var(--fill-1, black)" fillOpacity="0.4" fillRule="evenodd" />
            </g>
          </svg>
        </div>
        <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" data-name="Outer Stroke">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
            <path clipRule="evenodd" d={svgPaths.p18026100} fill="var(--fill-0, #D94A1E)" fillRule="evenodd" id="Outer Stroke" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" data-name="Outer Stroke Decoration">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
            <path clipRule="evenodd" d={svgPaths.p18026100} fill="url(#paint0_linear_3_920)" fillOpacity="0.2" fillRule="evenodd" id="Outer Stroke Decoration" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_920" x1="13.7945" x2="12.7279" y1="1.86667" y2="1.86667">
                <stop offset="0.331731" />
                <stop offset="0.341346" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-[10.35%_15.2%_9.65%_15.52%] mix-blend-overlay" data-name="Inner Stroke">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 25">
            <g id="Inner Stroke" style={{ mixBlendMode: "overlay" }}>
              <path clipRule="evenodd" d={svgPaths.p8db7f00} fill="var(--fill-0, #D94A1E)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p8db7f00} fill="var(--fill-1, white)" fillOpacity="0.7" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Contents4() {
  return (
    <div className="absolute box-border content-stretch flex inset-[31.25%_21.67%] items-center justify-center pl-[2.667px] pr-0 py-0" data-name="Contents">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-center text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[16px] whitespace-pre">10</p>
      </div>
      <div className="relative shrink-0 size-[12px]" data-name="Icon">
        <div className="absolute inset-[22.5%_21.67%_20.83%_21.67%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
            <path d={svgPaths.p37257ff0} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function LifeTile1() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Life Tile">
      <PlaqueStyle3 />
      <Contents4 />
    </div>
  );
}

function ListContainer1() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0 z-[1]" data-name="List container">
      <EnergyTile1 />
      <LifeTile1 />
    </div>
  );
}

function Name1() {
  return (
    <div className="bg-[rgba(51,51,51,0.4)] relative rounded-[8px] shrink-0 w-full" data-name="Name">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[4px] isolate items-center px-[16px] py-[8px] relative w-full">
          <Text1 />
          <ListContainer1 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#00e5ff] border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
    </div>
  );
}

function TextAutolayout1() {
  return (
    <div className="content-stretch flex flex-col gap-[8.477px] items-start relative shrink-0 w-full" data-name="Text Autolayout">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#1a1b25] text-[12px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Once per round, the next time you would take damage, reduce it by 1.
      </p>
    </div>
  );
}

function Abilities1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[8px] shrink-0 w-full" data-name="Abilities" style={{ backgroundImage: "linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.8) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.35) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.15) 100%)" }}>
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start px-[8px] py-[16px] relative size-full">
          <TextAutolayout1 />
        </div>
      </div>
    </div>
  );
}

function BackgroundMask5() {
  return (
    <div className="absolute contents inset-[1.667%]" data-name="Background Mask">
      <div className="absolute inset-[1.667%]" data-name="Mask">
        <div className="absolute bg-[#7ba589] inset-[3.448%] rounded-[166.5px]" data-name="Background" />
      </div>
      <div className="absolute inset-0 mix-blend-overlay" data-name="Texture">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img4} />
      </div>
      <div className="absolute inset-0" data-name="Shading">
        <div className="absolute inset-0 mix-blend-overlay" data-name="Shading" />
      </div>
    </div>
  );
}

function Contents5() {
  return (
    <div className="absolute box-border content-stretch flex inset-[31.25%_21.67%] items-center justify-center pl-0 pr-[1.333px] py-0" data-name="Contents">
      <div className="flex flex-col font-['Cinzel:Bold',sans-serif] font-bold justify-center leading-[0] mr-[-1.333px] relative shrink-0 text-[20.67px] text-black text-center text-nowrap tracking-[-0.8268px]">
        <p className="leading-[normal] whitespace-pre">3</p>
      </div>
    </div>
  );
}

function CharacterImage2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[156px] items-start relative rounded-[16px] shrink-0 w-full" data-name="Character Image">
      <img alt="" className="absolute inset-0 max-w-none mix-blend-screen object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={img} />
      <div className="basis-0 grow min-h-px min-w-px relative rounded-[16px] shrink-0 w-full" data-name="Image">
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={img6} />
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-full" />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start leading-[0] min-h-px min-w-px relative shrink-0 z-[2]" data-name="Text">
      <div className="flex flex-col font-['Fira_Sans:Medium',sans-serif] justify-center not-italic relative shrink-0 text-[#00e5ff] text-[16px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">Abyss Leviathan</p>
      </div>
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center min-w-full relative shrink-0 text-[12px] text-white w-[min-content]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[16px]">The deep devours.</p>
      </div>
    </div>
  );
}

function BackgroundMask6() {
  return (
    <div className="absolute contents inset-[1.667%]" data-name="Background Mask">
      <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[32px_32px] mix-blend-hard-light" data-name="Texture" style={{ maskImage: `url('${img2}')` }}>
        <div className="absolute inset-0 mix-blend-overlay" data-name="Texture">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img3} />
        </div>
      </div>
      <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[32px_32px]" data-name="Shading" style={{ maskImage: `url('${img2}')` }}>
        <div className="absolute inset-0 mix-blend-multiply" data-name="Shading" />
      </div>
    </div>
  );
}

function PlaqueStyle4() {
  return (
    <div className="absolute inset-0" data-name="Plaque Style">
      <div className="absolute inset-[1.667%] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.5)]" data-name="Background">
        <div className="absolute inset-[-1.724%]" data-name="Background">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="var(--fill-0, #00B3C8)" id="Background" />
          </svg>
        </div>
      </div>
      <BackgroundMask6 />
      <div className="absolute inset-[1.667%]" data-name="Plaque Border">
        <div className="absolute inset-0" data-name="Shadow">
          <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
              <g filter="url(#filter0_i_3_930)" id="Shadow">
                <path d={svgPaths.pbcded80} fill="var(--fill-0, white)" style={{ mixBlendMode: "multiply" }} />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="30.9333" id="filter0_i_3_930" width="26.7891" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2.25333" />
                  <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0" />
                  <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_930" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
        <div className="absolute inset-[2.59%_8.62%]" data-name="Bevel">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 30">
            <g id="Bevel">
              <path clipRule="evenodd" d={svgPaths.p3d23f590} fill="var(--fill-0, #00B3C8)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p3d23f590} fill="var(--fill-1, black)" fillOpacity="0.4" fillRule="evenodd" />
            </g>
          </svg>
        </div>
        <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" data-name="Outer Stroke">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
            <path clipRule="evenodd" d={svgPaths.p18026100} fill="var(--fill-0, #00B3C8)" fillRule="evenodd" id="Outer Stroke" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" data-name="Outer Stroke Decoration">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
            <path clipRule="evenodd" d={svgPaths.p18026100} fill="url(#paint0_linear_3_920)" fillOpacity="0.2" fillRule="evenodd" id="Outer Stroke Decoration" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_920" x1="13.7945" x2="12.7279" y1="1.86667" y2="1.86667">
                <stop offset="0.331731" />
                <stop offset="0.341346" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-[10.35%_15.2%_9.65%_15.52%] mix-blend-overlay" data-name="Inner Stroke">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 25">
            <g id="Inner Stroke" style={{ mixBlendMode: "overlay" }}>
              <path clipRule="evenodd" d={svgPaths.p8db7f00} fill="var(--fill-0, #00B3C8)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p8db7f00} fill="var(--fill-1, white)" fillOpacity="0.7" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Contents6() {
  return (
    <div className="absolute box-border content-stretch flex inset-[31.25%_21.67%] items-center justify-center pl-[2.667px] pr-0 py-0" data-name="Contents">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-center text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[16px] whitespace-pre">9</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[12px]" data-name="Icon">
        <div className="absolute inset-[7.42%_28.71%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 11">
            <path d={svgPaths.p196f6d00} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function EnergyTile2() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Energy Tile">
      <PlaqueStyle4 />
      <Contents6 />
    </div>
  );
}

function BackgroundMask7() {
  return (
    <div className="absolute contents inset-[1.667%]" data-name="Background Mask">
      <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[32px_32px] mix-blend-hard-light" data-name="Texture" style={{ maskImage: `url('${img2}')` }}>
        <div className="absolute inset-0 mix-blend-overlay" data-name="Texture">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img3} />
        </div>
      </div>
      <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[32px_32px]" data-name="Shading" style={{ maskImage: `url('${img2}')` }}>
        <div className="absolute inset-0 mix-blend-multiply" data-name="Shading" />
      </div>
    </div>
  );
}

function PlaqueStyle5() {
  return (
    <div className="absolute inset-0" data-name="Plaque Style">
      <div className="absolute inset-[1.667%] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.5)]" data-name="Background">
        <div className="absolute inset-[-1.724%]" data-name="Background">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="var(--fill-0, #D94A1E)" id="Background" />
          </svg>
        </div>
      </div>
      <BackgroundMask7 />
      <div className="absolute inset-[1.667%]" data-name="Plaque Border">
        <div className="absolute inset-0" data-name="Shadow">
          <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
              <g filter="url(#filter0_i_3_930)" id="Shadow">
                <path d={svgPaths.pbcded80} fill="var(--fill-0, white)" style={{ mixBlendMode: "multiply" }} />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="30.9333" id="filter0_i_3_930" width="26.7891" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2.25333" />
                  <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0" />
                  <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_930" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
        <div className="absolute inset-[2.59%_8.62%]" data-name="Bevel">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 30">
            <g id="Bevel">
              <path clipRule="evenodd" d={svgPaths.p3d23f590} fill="var(--fill-0, #D94A1E)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p3d23f590} fill="var(--fill-1, black)" fillOpacity="0.4" fillRule="evenodd" />
            </g>
          </svg>
        </div>
        <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" data-name="Outer Stroke">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
            <path clipRule="evenodd" d={svgPaths.p18026100} fill="var(--fill-0, #D94A1E)" fillRule="evenodd" id="Outer Stroke" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" data-name="Outer Stroke Decoration">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
            <path clipRule="evenodd" d={svgPaths.p18026100} fill="url(#paint0_linear_3_920)" fillOpacity="0.2" fillRule="evenodd" id="Outer Stroke Decoration" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_920" x1="13.7945" x2="12.7279" y1="1.86667" y2="1.86667">
                <stop offset="0.331731" />
                <stop offset="0.341346" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-[10.35%_15.2%_9.65%_15.52%] mix-blend-overlay" data-name="Inner Stroke">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 25">
            <g id="Inner Stroke" style={{ mixBlendMode: "overlay" }}>
              <path clipRule="evenodd" d={svgPaths.p8db7f00} fill="var(--fill-0, #D94A1E)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p8db7f00} fill="var(--fill-1, white)" fillOpacity="0.7" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Contents7() {
  return (
    <div className="absolute box-border content-stretch flex inset-[31.25%_21.67%] items-center justify-center pl-[2.667px] pr-0 py-0" data-name="Contents">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-center text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[16px] whitespace-pre">10</p>
      </div>
      <div className="relative shrink-0 size-[12px]" data-name="Icon">
        <div className="absolute inset-[22.5%_21.67%_20.83%_21.67%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
            <path d={svgPaths.p37257ff0} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function LifeTile2() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Life Tile">
      <PlaqueStyle5 />
      <Contents7 />
    </div>
  );
}

function ListContainer2() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0 z-[1]" data-name="List container">
      <EnergyTile2 />
      <LifeTile2 />
    </div>
  );
}

function Name2() {
  return (
    <div className="bg-[rgba(51,51,51,0.4)] relative rounded-[8px] shrink-0 w-full" data-name="Name">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[4px] isolate items-center px-[16px] py-[8px] relative w-full">
          <Text2 />
          <ListContainer2 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#00e5ff] border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
    </div>
  );
}

function TextAutolayout2() {
  return (
    <div className="content-stretch flex flex-col gap-[8.477px] items-start relative shrink-0 w-full" data-name="Text Autolayout">
      <p className="font-['Roboto:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#1a1b25] text-[12px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>{`When resolving Hearts on your turn and already reached your maximum (10)  you may convert up to 2 unused Hearts into Energy (1 Heart → 1 Energy). Once per round.`}</p>
    </div>
  );
}

function Abilities2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[8px] shrink-0 w-full" data-name="Abilities" style={{ backgroundImage: "linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.8) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.35) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.15) 100%)" }}>
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start px-[8px] py-[16px] relative size-full">
          <TextAutolayout2 />
        </div>
      </div>
    </div>
  );
}

function BackgroundMask8() {
  return (
    <div className="absolute contents inset-[1.667%]" data-name="Background Mask">
      <div className="absolute inset-[1.667%]" data-name="Mask">
        <div className="absolute bg-[#7ba589] inset-[3.448%] rounded-[166.5px]" data-name="Background" />
      </div>
      <div className="absolute inset-0 mix-blend-overlay" data-name="Texture">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img4} />
      </div>
      <div className="absolute inset-0" data-name="Shading">
        <div className="absolute inset-0 mix-blend-overlay" data-name="Shading" />
      </div>
    </div>
  );
}

function Contents8() {
  return (
    <div className="absolute box-border content-stretch flex inset-[31.25%_21.67%] items-center justify-center pl-0 pr-[1.333px] py-0" data-name="Contents">
      <div className="flex flex-col font-['Cinzel:Bold',sans-serif] font-bold justify-center leading-[0] mr-[-1.333px] relative shrink-0 text-[20.67px] text-black text-center text-nowrap tracking-[-0.8268px]">
        <p className="leading-[normal] whitespace-pre">3</p>
      </div>
    </div>
  );
}

function CharacterImage3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[156px] items-start relative rounded-[16px] shrink-0 w-full" data-name="Character Image">
      <img alt="" className="absolute inset-0 max-w-none mix-blend-screen object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={img} />
      <div className="basis-0 grow min-h-px min-w-px relative rounded-[16px] shrink-0 w-full" data-name="Image">
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={img7} />
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-full" />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start leading-[0] min-h-px min-w-px relative shrink-0 z-[2]" data-name="Text">
      <div className="flex flex-col font-['Fira_Sans:Medium',sans-serif] justify-center not-italic relative shrink-0 text-[#00e5ff] text-[16px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">Halo Cyclops</p>
      </div>
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center min-w-full relative shrink-0 text-[12px] text-white w-[min-content]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[16px]">The eye that burns</p>
      </div>
    </div>
  );
}

function BackgroundMask9() {
  return (
    <div className="absolute contents inset-[1.667%]" data-name="Background Mask">
      <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[32px_32px] mix-blend-hard-light" data-name="Texture" style={{ maskImage: `url('${img2}')` }}>
        <div className="absolute inset-0 mix-blend-overlay" data-name="Texture">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img3} />
        </div>
      </div>
      <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[32px_32px]" data-name="Shading" style={{ maskImage: `url('${img2}')` }}>
        <div className="absolute inset-0 mix-blend-multiply" data-name="Shading" />
      </div>
    </div>
  );
}

function PlaqueStyle6() {
  return (
    <div className="absolute inset-0" data-name="Plaque Style">
      <div className="absolute inset-[1.667%] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.5)]" data-name="Background">
        <div className="absolute inset-[-1.724%]" data-name="Background">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="var(--fill-0, #00B3C8)" id="Background" />
          </svg>
        </div>
      </div>
      <BackgroundMask9 />
      <div className="absolute inset-[1.667%]" data-name="Plaque Border">
        <div className="absolute inset-0" data-name="Shadow">
          <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
              <g filter="url(#filter0_i_3_930)" id="Shadow">
                <path d={svgPaths.pbcded80} fill="var(--fill-0, white)" style={{ mixBlendMode: "multiply" }} />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="30.9333" id="filter0_i_3_930" width="26.7891" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2.25333" />
                  <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0" />
                  <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_930" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
        <div className="absolute inset-[2.59%_8.62%]" data-name="Bevel">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 30">
            <g id="Bevel">
              <path clipRule="evenodd" d={svgPaths.p3d23f590} fill="var(--fill-0, #00B3C8)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p3d23f590} fill="var(--fill-1, black)" fillOpacity="0.4" fillRule="evenodd" />
            </g>
          </svg>
        </div>
        <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" data-name="Outer Stroke">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
            <path clipRule="evenodd" d={svgPaths.p18026100} fill="var(--fill-0, #00B3C8)" fillRule="evenodd" id="Outer Stroke" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" data-name="Outer Stroke Decoration">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
            <path clipRule="evenodd" d={svgPaths.p18026100} fill="url(#paint0_linear_3_920)" fillOpacity="0.2" fillRule="evenodd" id="Outer Stroke Decoration" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_920" x1="13.7945" x2="12.7279" y1="1.86667" y2="1.86667">
                <stop offset="0.331731" />
                <stop offset="0.341346" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-[10.35%_15.2%_9.65%_15.52%] mix-blend-overlay" data-name="Inner Stroke">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 25">
            <g id="Inner Stroke" style={{ mixBlendMode: "overlay" }}>
              <path clipRule="evenodd" d={svgPaths.p8db7f00} fill="var(--fill-0, #00B3C8)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p8db7f00} fill="var(--fill-1, white)" fillOpacity="0.7" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Contents9() {
  return (
    <div className="absolute box-border content-stretch flex inset-[31.25%_21.67%] items-center justify-center pl-[2.667px] pr-0 py-0" data-name="Contents">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-center text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[16px] whitespace-pre">9</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[12px]" data-name="Icon">
        <div className="absolute inset-[7.42%_28.71%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 11">
            <path d={svgPaths.p196f6d00} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function EnergyTile3() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Energy Tile">
      <PlaqueStyle6 />
      <Contents9 />
    </div>
  );
}

function BackgroundMask10() {
  return (
    <div className="absolute contents inset-[1.667%]" data-name="Background Mask">
      <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[32px_32px] mix-blend-hard-light" data-name="Texture" style={{ maskImage: `url('${img2}')` }}>
        <div className="absolute inset-0 mix-blend-overlay" data-name="Texture">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img3} />
        </div>
      </div>
      <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[32px_32px]" data-name="Shading" style={{ maskImage: `url('${img2}')` }}>
        <div className="absolute inset-0 mix-blend-multiply" data-name="Shading" />
      </div>
    </div>
  );
}

function PlaqueStyle7() {
  return (
    <div className="absolute inset-0" data-name="Plaque Style">
      <div className="absolute inset-[1.667%] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.5)]" data-name="Background">
        <div className="absolute inset-[-1.724%]" data-name="Background">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="var(--fill-0, #D94A1E)" id="Background" />
          </svg>
        </div>
      </div>
      <BackgroundMask10 />
      <div className="absolute inset-[1.667%]" data-name="Plaque Border">
        <div className="absolute inset-0" data-name="Shadow">
          <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
              <g filter="url(#filter0_i_3_930)" id="Shadow">
                <path d={svgPaths.pbcded80} fill="var(--fill-0, white)" style={{ mixBlendMode: "multiply" }} />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="30.9333" id="filter0_i_3_930" width="26.7891" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2.25333" />
                  <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0" />
                  <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_930" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
        <div className="absolute inset-[2.59%_8.62%]" data-name="Bevel">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 30">
            <g id="Bevel">
              <path clipRule="evenodd" d={svgPaths.p3d23f590} fill="var(--fill-0, #D94A1E)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p3d23f590} fill="var(--fill-1, black)" fillOpacity="0.4" fillRule="evenodd" />
            </g>
          </svg>
        </div>
        <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" data-name="Outer Stroke">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
            <path clipRule="evenodd" d={svgPaths.p18026100} fill="var(--fill-0, #D94A1E)" fillRule="evenodd" id="Outer Stroke" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0" data-name="Outer Stroke Decoration">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
            <path clipRule="evenodd" d={svgPaths.p18026100} fill="url(#paint0_linear_3_920)" fillOpacity="0.2" fillRule="evenodd" id="Outer Stroke Decoration" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_920" x1="13.7945" x2="12.7279" y1="1.86667" y2="1.86667">
                <stop offset="0.331731" />
                <stop offset="0.341346" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-[10.35%_15.2%_9.65%_15.52%] mix-blend-overlay" data-name="Inner Stroke">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 25">
            <g id="Inner Stroke" style={{ mixBlendMode: "overlay" }}>
              <path clipRule="evenodd" d={svgPaths.p8db7f00} fill="var(--fill-0, #D94A1E)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p8db7f00} fill="var(--fill-1, white)" fillOpacity="0.7" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Contents10() {
  return (
    <div className="absolute box-border content-stretch flex inset-[31.25%_21.67%] items-center justify-center pl-[2.667px] pr-0 py-0" data-name="Contents">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-center text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[16px] whitespace-pre">10</p>
      </div>
      <div className="relative shrink-0 size-[12px]" data-name="Icon">
        <div className="absolute inset-[22.5%_21.67%_20.83%_21.67%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
            <path d={svgPaths.p37257ff0} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function LifeTile3() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Life Tile">
      <PlaqueStyle7 />
      <Contents10 />
    </div>
  );
}

function ListContainer3() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0 z-[1]" data-name="List container">
      <EnergyTile3 />
      <LifeTile3 />
    </div>
  );
}

function Name3() {
  return (
    <div className="bg-[rgba(51,51,51,0.4)] relative rounded-[8px] shrink-0 w-full" data-name="Name">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[4px] isolate items-center px-[16px] py-[8px] relative w-full">
          <Text3 />
          <ListContainer3 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#00e5ff] border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
    </div>
  );
}

function TextAutolayout3() {
  return (
    <div className="content-stretch flex flex-col gap-[8.477px] items-start relative shrink-0 w-full" data-name="Text Autolayout">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#1a1b25] text-[12px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Once per round, convert 1 Energy into 1 Heart (up to 10) or 1 Heart into 1 Energy.
      </p>
    </div>
  );
}

function Abilities3() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[8px] shrink-0 w-full" data-name="Abilities" style={{ backgroundImage: "linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.8) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.35) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.15) 100%)" }}>
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start px-[8px] py-[16px] relative size-full">
          <TextAutolayout3 />
        </div>
      </div>
    </div>
  );
}

function BackgroundMask11() {
  return (
    <div className="absolute contents inset-[1.667%]" data-name="Background Mask">
      <div className="absolute inset-[1.667%]" data-name="Mask">
        <div className="absolute bg-[#7ba589] inset-[3.448%] rounded-[166.5px]" data-name="Background" />
      </div>
      <div className="absolute inset-0 mix-blend-overlay" data-name="Texture">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img4} />
      </div>
      <div className="absolute inset-0" data-name="Shading">
        <div className="absolute inset-0 mix-blend-overlay" data-name="Shading" />
      </div>
    </div>
  );
}

function Contents11() {
  return (
    <div className="absolute box-border content-stretch flex inset-[31.25%_21.67%] items-center justify-center pl-0 pr-[1.333px] py-0" data-name="Contents">
      <div className="flex flex-col font-['Cinzel:Bold',sans-serif] font-bold justify-center leading-[0] mr-[-1.333px] relative shrink-0 text-[20.67px] text-black text-center text-nowrap tracking-[-0.8268px]">
        <p className="leading-[normal] whitespace-pre">3</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-start flex flex-wrap gap-[22.113px] items-start left-[151px] top-[622px] w-[1172px]">
      <div className="box-border content-stretch flex flex-col gap-[8px] h-[386px] items-center overflow-clip p-[16px] relative rounded-[16px] shrink-0 w-[276px]" data-name="Character Card">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={img1} />
        <CharacterImage />
        <Name />
        <Abilities />
        <div className="absolute left-[228px] size-[40px] top-[8px]" data-name="Points">
          <div className="absolute inset-0" data-name="Plaque Style">
            <div className="absolute inset-[1.667%] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.5)]" data-name="Background">
              <div className="absolute bg-[#f5dc3f] inset-[3.448%] rounded-[166.5px]" data-name="Background" />
            </div>
            <BackgroundMask2 />
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
                <img alt="" className="block max-w-none size-full" height="36" src={img8} width="36" />
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
          <div className="absolute inset-0" data-name="Text + Icon">
            <Contents2 />
          </div>
        </div>
      </div>
      <div className="box-border content-stretch flex flex-col gap-[8px] h-[386px] items-center overflow-clip p-[16px] relative rounded-[16px] shrink-0 w-[276px]" data-name="Character Card">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={img5} />
        <CharacterImage1 />
        <Name1 />
        <Abilities1 />
        <div className="absolute left-[228px] size-[40px] top-[8px]" data-name="Points">
          <div className="absolute inset-0" data-name="Plaque Style">
            <div className="absolute inset-[1.667%] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.5)]" data-name="Background">
              <div className="absolute bg-[#f5dc3f] inset-[3.448%] rounded-[166.5px]" data-name="Background" />
            </div>
            <BackgroundMask5 />
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
                <img alt="" className="block max-w-none size-full" height="36" src={img8} width="36" />
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
          <div className="absolute inset-0" data-name="Text + Icon">
            <Contents5 />
          </div>
        </div>
      </div>
      <div className="box-border content-stretch flex flex-col gap-[8px] h-[386px] items-center overflow-clip p-[16px] relative rounded-[16px] shrink-0 w-[276px]" data-name="Character Card">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={img6} />
        <CharacterImage2 />
        <Name2 />
        <Abilities2 />
        <div className="absolute left-[228px] size-[40px] top-[8px]" data-name="Points">
          <div className="absolute inset-0" data-name="Plaque Style">
            <div className="absolute inset-[1.667%] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.5)]" data-name="Background">
              <div className="absolute bg-[#f5dc3f] inset-[3.448%] rounded-[166.5px]" data-name="Background" />
            </div>
            <BackgroundMask8 />
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
                <img alt="" className="block max-w-none size-full" height="36" src={img8} width="36" />
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
          <div className="absolute inset-0" data-name="Text + Icon">
            <Contents8 />
          </div>
        </div>
      </div>
      <div className="box-border content-stretch flex flex-col gap-[8px] h-[386px] items-center overflow-clip p-[16px] relative rounded-[16px] shrink-0 w-[276px]" data-name="Character Card">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={img7} />
        <CharacterImage3 />
        <Name3 />
        <Abilities3 />
        <div className="absolute left-[228px] size-[40px] top-[8px]" data-name="Points">
          <div className="absolute inset-0" data-name="Plaque Style">
            <div className="absolute inset-[1.667%] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.5)]" data-name="Background">
              <div className="absolute bg-[#f5dc3f] inset-[3.448%] rounded-[166.5px]" data-name="Background" />
            </div>
            <BackgroundMask11 />
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
                <img alt="" className="block max-w-none size-full" height="36" src={img8} width="36" />
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
          <div className="absolute inset-0" data-name="Text + Icon">
            <Contents11 />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GameView() {
  return (
    <div className="relative size-full" data-name="Game view">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <img alt="" className="absolute max-w-none object-50%-50% object-cover opacity-50 size-full" src={imgGameView} />
        <div className="absolute bg-[rgba(13,3,65,0.4)] inset-0" />
      </div>
      <MainBoard />
      <Frame1 />
    </div>
  );
}