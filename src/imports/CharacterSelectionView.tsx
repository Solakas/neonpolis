import imgCharacterSelectionView from "figma:asset/b846c94630162592b46129a3d823bb962ef9519a.png";

function Copy() {
  return (
    <div className="content-stretch flex flex-col font-['Fira_Sans:Black',sans-serif] gap-[16px] items-start not-italic relative shrink-0 w-full" data-name="Copy">
      <p className="leading-[normal] relative shrink-0 text-[#00e5ff] text-[64px] text-center w-full">Victory</p>
      <p className="leading-[44px] relative shrink-0 text-[36px] text-white w-full">You are the champion of NeonPolis</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-[#00e5ff] box-border content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[16px] relative rounded-[8px] shrink-0">
      <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#0a0f14] text-[18px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Rematch
      </p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[16px] relative rounded-[8px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#00b3c8] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[18px] text-nowrap text-white whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Main View
      </p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame13 />
      <Frame14 />
    </div>
  );
}

function Conten() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[52px] items-center left-[457px] top-[calc(50%-0.5px)] translate-y-[-50%] w-[571px]" data-name="Conten">
      <Copy />
      <Frame15 />
    </div>
  );
}

export default function CharacterSelectionView() {
  return (
    <div className="relative size-full" data-name="Character selection View">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src={imgCharacterSelectionView} />
        <div className="absolute bg-[rgba(13,3,65,0.7)] inset-0" />
      </div>
      <Conten />
    </div>
  );
}