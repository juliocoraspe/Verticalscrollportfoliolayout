import svgPaths from "./svg-gtu91u5dez";

function Label() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[20px] left-0 top-0 w-[343px]" data-name="label">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[normal] left-0 not-italic text-[#374151] text-[14px] top-px w-[70px]">Task Title</p>
    </div>
  );
}

function Input() {
  return (
    <div className="absolute bg-[#fafcfc] h-[50px] left-0 rounded-[8px] shadow-[-5px_-5px_10px_0px_white,5px_5px_10px_0px_rgba(0,0,0,0.25)] top-[28px] w-[343px]" data-name="input">
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[50px] justify-center leading-[0] left-[16px] not-italic text-[#adaebc] text-[16px] top-[25px] translate-y-[-50%] w-[343px]">
        <p className="leading-[24px]">Enter task title</p>
      </div>
    </div>
  );
}

function Div() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[78px] left-[25px] top-[24px] w-[343px]" data-name="div">
      <Label />
      <Input />
    </div>
  );
}

function Label1() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[20px] left-0 top-0 w-[343px]" data-name="label">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[normal] left-0 not-italic text-[#374151] text-[14px] top-px w-[67px]">Category</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute left-[303px] size-[32px] top-[8px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Frame">
          <path clipRule="evenodd" d={svgPaths.pfd263c0} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Select() {
  return (
    <div className="absolute bg-[#fafcfc] h-[48px] left-0 rounded-[8px] shadow-[-5px_-5px_10px_0px_white,5px_5px_10px_0px_rgba(0,0,0,0.25)] top-[28px] w-[343px]" data-name="select">
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[48px] justify-center leading-[0] left-[12px] not-italic overflow-ellipsis overflow-hidden text-[16px] text-black text-nowrap top-[24px] translate-y-[-50%] w-[120px]">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">Select category</p>
      </div>
      <Frame />
    </div>
  );
}

function Div1() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[76px] left-[25px] top-[126px] w-[343px]" data-name="div">
      <Label1 />
      <Select />
    </div>
  );
}

function Label2() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[20px] left-0 top-0 w-[343px]" data-name="label">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[normal] left-0 not-italic text-[#374151] text-[14px] top-px w-[93px]">Priority Level</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute left-[303px] size-[32px] top-[8px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Frame">
          <path clipRule="evenodd" d={svgPaths.pfd263c0} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Select1() {
  return (
    <div className="absolute bg-[#fafcfc] h-[48px] left-0 rounded-[8px] shadow-[-5px_-5px_10px_0px_white,5px_5px_10px_0px_rgba(0,0,0,0.25)] top-[28px] w-[343px]" data-name="select">
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[48px] justify-center leading-[0] left-[12px] not-italic overflow-ellipsis overflow-hidden text-[16px] text-black text-nowrap top-[24px] translate-y-[-50%] w-[106px]">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">Select priority</p>
      </div>
      <Frame1 />
    </div>
  );
}

function Div2() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[76px] left-[25px] top-[226px] w-[343px]" data-name="div">
      <Label2 />
      <Select1 />
    </div>
  );
}

function Label3() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[20px] left-0 top-0 w-[343px]" data-name="label">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[normal] left-0 not-italic text-[#374151] text-[14px] top-px w-[36px]">Date</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p347fa80} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Svg() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[305px] size-[24px] top-[10px]" data-name="svg">
      <Frame2 />
    </div>
  );
}

function Input1() {
  return (
    <div className="absolute bg-[#fafcfc] h-[52px] left-0 rounded-[8px] shadow-[-5px_-5px_10px_0px_white,5px_5px_10px_0px_rgba(0,0,0,0.25)] top-0 w-[343px]" data-name="input">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[24px] leading-[24px] left-[26px] not-italic text-[18px] text-black top-[16px] w-[343px]">mm/dd/yyyy</p>
      <Svg />
    </div>
  );
}

function Div3() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[52px] left-0 top-[28px] w-[343px]" data-name="div">
      <Input1 />
    </div>
  );
}

function Div4() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[80px] left-0 top-0 w-[343px]" data-name="div">
      <Label3 />
      <Div3 />
    </div>
  );
}

function Label4() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[20px] left-0 top-0 w-[343px]" data-name="label">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[normal] left-0 not-italic text-[#374151] text-[14px] top-px w-[39px]">Time</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p19fddb00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Svg1() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[305px] size-[24px] top-[10px]" data-name="svg">
      <Frame3 />
    </div>
  );
}

function Input2() {
  return (
    <div className="absolute bg-[#fafcfc] h-[52px] left-0 rounded-[8px] shadow-[-5px_-5px_10px_0px_white,5px_5px_10px_0px_rgba(0,0,0,0.25)] top-0 w-[343px]" data-name="input">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[24px] leading-[24px] left-[26px] not-italic text-[18px] text-black top-[16px] w-[343px]">--:-- --</p>
      <Svg1 />
    </div>
  );
}

function I() {
  return <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[311px] top-[14px] w-[16px]" data-name="i" />;
}

function Div5() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] h-[52px] left-0 shadow-[-5px_-5px_10px_0px_white,5px_5px_10px_0px_rgba(0,0,0,0.25)] top-[28px] w-[343px]" data-name="div">
      <Input2 />
      <I />
    </div>
  );
}

function Div6() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[80px] left-0 top-[96px] w-[343px]" data-name="div">
      <Label4 />
      <Div5 />
    </div>
  );
}

function Div7() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[176px] left-[25px] top-[326px] w-[343px]" data-name="div">
      <Div4 />
      <Div6 />
    </div>
  );
}

function Before() {
  return <div className="absolute bg-white border-0 border-[#e5e7eb] border-solid left-[3px] rounded-[50px] shadow-[-5px_-5px_10px_0px_white,5px_5px_10px_0px_rgba(0,0,0,0.25)] size-[18px] top-[3px]" data-name="::before" />;
}

function Span() {
  return (
    <div className="absolute bg-[#e5e7eb] border-0 border-[#e5e7eb] border-solid h-[24px] left-0 rounded-[24px] top-0 w-[48px]" data-name="span">
      <Before />
    </div>
  );
}

function Label5() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[290px] shadow-[-5px_-5px_10px_0px_white,5px_5px_10px_0px_rgba(0,0,0,0.25)] top-[8px] w-[48px]" data-name="label">
      <Span />
    </div>
  );
}

function Div8() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[40px] left-0 top-[36px] w-[343px]" data-name="div">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[24px] leading-[24px] left-0 not-italic text-[#111827] text-[16px] top-[8px] w-[100px]">1 hour before</p>
      <Label5 />
    </div>
  );
}

function Before1() {
  return <div className="absolute bg-white border-0 border-[#e5e7eb] border-solid left-[3px] rounded-[50px] shadow-[-5px_-5px_10px_0px_white,5px_5px_10px_0px_rgba(0,0,0,0.25)] size-[18px] top-[3px]" data-name="::before" />;
}

function Span1() {
  return (
    <div className="absolute bg-[#e5e7eb] border-0 border-[#e5e7eb] border-solid h-[24px] left-0 rounded-[24px] top-0 w-[48px]" data-name="span">
      <Before1 />
    </div>
  );
}

function Label6() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[290px] shadow-[-5px_-5px_10px_0px_white,5px_5px_10px_0px_rgba(0,0,0,0.25)] top-[8px] w-[48px]" data-name="label">
      <Span1 />
    </div>
  );
}

function Div9() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[40px] left-0 top-[76px] w-[343px]" data-name="div">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[24px] leading-[24px] left-0 not-italic text-[#111827] text-[16px] top-[8px] w-[136px]">10 minutes before</p>
      <Label6 />
    </div>
  );
}

function Div10() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[132px] left-[25px] top-[526px] w-[343px]" data-name="div">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[20px] left-0 not-italic text-[#374151] text-[14px] top-[16px] w-[77px]">Reminders</p>
      <Div8 />
      <Div9 />
    </div>
  );
}

function Label7() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[20px] left-0 top-[-10px] w-[343px]" data-name="label">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[normal] left-0 not-italic text-[#374151] text-[14px] top-px w-[152px]">Description (Optional)</p>
    </div>
  );
}

function Textarea() {
  return (
    <div className="absolute bg-[#fafcfc] h-[122px] left-0 overflow-clip rounded-[8px] shadow-[-5px_-5px_10px_0px_white,5px_5px_10px_0px_rgba(0,0,0,0.25)] top-[28px] w-[343px]" data-name="textarea">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[122px] leading-[24px] left-[16px] not-italic text-[#adaebc] text-[16px] top-[12px] w-[343px]">Add task description...</p>
    </div>
  );
}

function Div11() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[156px] left-[25px] top-[682px] w-[343px]" data-name="div">
      <Label7 />
      <Textarea />
    </div>
  );
}

function Main() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[862px] left-[-1px] top-[68px] w-[393px]" data-name="main">
      <Div />
      <Div1 />
      <Div2 />
      <Div7 />
      <Div10 />
      <Div11 />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#425257] border-0 border-[#e5e7eb] border-solid h-[48px] left-[7px] rounded-[8px] shadow-[-5px_-5px_10px_0px_white,5px_5px_10px_0px_rgba(0,0,0,0.25)] top-0 w-[343px]" data-name="button">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[174.42px] not-italic text-[16px] text-center text-white top-[14px] translate-x-[-50%] w-[97px]">Create Task</p>
    </div>
  );
}

function Button1() {
  return (
    <button className="absolute bg-[#f3f4f6] block border-0 border-[#e5e5e5] border-solid cursor-pointer h-[48px] left-[7px] rounded-[8px] shadow-[-5px_-5px_10px_0px_white,5px_5px_10px_0px_rgba(0,0,0,0.25)] top-[60px] w-[343px]" data-name="button">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[174.44px] not-italic text-[#374151] text-[16px] text-center top-[14px] translate-x-[-50%] w-[59px]">Cancel</p>
    </button>
  );
}

function Div12() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[108px] left-[16px] top-[16px] w-[343px]" data-name="div">
      <Button />
      <Button1 />
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute bg-[#fafcfc] border-[#e5e7eb] border-[1px_0px_0px] border-solid h-[141px] left-[-1px] top-[930px] w-[393px]" data-name="footer">
      <Div12 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="h-[18px] relative shrink-0 w-[15.75px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.75 18">
        <g id="Frame">
          <g clipPath="url(#clip0_3_650)">
            <path d={svgPaths.p209ef480} fill="var(--fill-0, #4B5563)" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_3_650">
            <path d="M0 0H15.75V18H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Svg2() {
  return (
    <div className="absolute content-stretch flex h-[18px] items-center justify-center left-0 top-[1.25px] w-[15.75px]" data-name="svg">
      <Frame4 />
    </div>
  );
}

function I1() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[21px] left-[8px] top-[11px] w-[15.75px]" data-name="i">
      <Svg2 />
    </div>
  );
}

function Button2() {
  return (
    <button className="absolute bg-[rgba(0,0,0,0)] block border-0 border-[#e5e7eb] border-solid cursor-pointer h-[44px] left-[-8px] top-0 w-[31.75px]" data-name="button">
      <I1 />
    </button>
  );
}

function Div13() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[44px] left-[25px] top-[98px] w-[343px]" data-name="div">
      <Button2 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[28px] leading-[28px] left-[129px] not-italic text-[#111827] text-[18px] top-[16px] w-[85px]">New Task</p>
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-[#fafcfc] border-[#e5e7eb] border-[0px_0px_1px] border-solid h-[195px] left-[-1px] shadow-[-5px_-5px_10px_0px_white,5px_5px_10px_0px_rgba(0,0,0,0.25)] top-[-127px] w-[393px]" data-name="header">
      <Div13 />
    </div>
  );
}

export default function Div14() {
  return (
    <div className="bg-[#f1f6f6] border border-[#e5e7eb] border-solid relative size-full" data-name="div">
      <Main />
      <Footer />
      <Header />
    </div>
  );
}