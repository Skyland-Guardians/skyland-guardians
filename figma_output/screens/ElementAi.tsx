import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const ElementAi = (): JSX.Element => {
  // Data for the bottom action cards
  const actionCards = [
    {
      id: "sword",
      label: "sword",
      image:
        "https://c.animaapp.com/mesjvl6vWsB6I2/img/chatgpt-image-2025-8-26--16-48-07-1.png",
      bgClass: "bg-[#1c3456] rounded-[0px_0px_11px_6px]",
    },
    {
      id: "shield",
      label: "shield",
      image:
        "https://c.animaapp.com/mesjvl6vWsB6I2/img/chatgpt-image-2025-8-26--17-00-36-1.png",
      bgClass: "bg-[#1c3456] rounded-[0px_0px_11px_11px]",
    },
    {
      id: "forest",
      label: "forest",
      image:
        "https://c.animaapp.com/mesjvl6vWsB6I2/img/chatgpt-image-2025-8-26--17-03-21-1.png",
      bgClass: "bg-[#1c3456] rounded-[0px_0px_11px_11px]",
    },
    {
      id: "ask-ali",
      label: "ask ali",
      image:
        "https://c.animaapp.com/mesjvl6vWsB6I2/img/chatgpt-image-2025-8-26--19-17-17-1.png",
      bgClass: "bg-[#1c3456] rounded-[0px_0px_11px_11px]",
    },
    {
      id: "golden",
      label: "golden",
      image:
        "https://c.animaapp.com/mesjvl6vWsB6I2/img/chatgpt-image-2025-8-26--17-39-36-1.png",
      bgClass: "bg-[#1c3456] rounded-[0px_0px_6px_6px]",
    },
    {
      id: "fountain",
      label: "fountain",
      image:
        "https://c.animaapp.com/mesjvl6vWsB6I2/img/chatgpt-image-2025-8-26--17-41-35-1.png",
      bgClass: "bg-[#1c3456] rounded-[0px_0px_6px_6px]",
    },
    {
      id: "crystal",
      label: "crystal",
      image:
        "https://c.animaapp.com/mesjvl6vWsB6I2/img/chatgpt-image-2025-8-26--17-43-32-1.png",
      bgClass: "bg-[#1c3456] rounded-[0px_0px_6px_6px]",
    },
    {
      id: "magic",
      label: "magic",
      image:
        "https://c.animaapp.com/mesjvl6vWsB6I2/img/chatgpt-image-2025-8-26--17-47-10-1.png",
      bgClass: "bg-[#1c3456] rounded-[0px_0px_6px_6px]",
    },
  ];

  return (
    <main
      className="w-[1280px] h-[720px] bg-[#fff5e5] translate-y-[-1rem] animate-fade-in opacity-0"
      data-model-id="2418:6396"
    >
      <div className="relative h-[700px] top-5">
        <div className="grid grid-cols-12 gap-4 h-[663px] mt-[37px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
          {/* Background landscape images */}
          <img
            className="col-span-12 w-[1279px] h-[419px] mt-[244px] ml-0"
            alt="Vector"
            src="https://c.animaapp.com/mesjvl6vWsB6I2/img/vector-108.png"
          />

          <img
            className="absolute w-[1278px] h-[351px] top-[312px] left-0.5"
            alt="Subtract"
            src="https://c.animaapp.com/mesjvl6vWsB6I2/img/subtract.png"
          />

          {/* Main landscape illustration */}
          <img
            className="absolute w-[745px] h-[652px] top-[11px] left-[242px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]"
            alt="Chatgpt image"
            src="https://c.animaapp.com/mesjvl6vWsB6I2/img/chatgpt-image-2025-8-26--15-20-55-1.png"
          />

          {/* Header text */}
          <header className="absolute w-[233px] h-[21px] top-0 left-[123px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
            <h1 className="[font-family:'Koulen',Helvetica] font-normal text-[#193455] text-xl tracking-[0] leading-[normal] whitespace-nowrap">
              james, guard your fortune！
            </h1>
          </header>

          {/* My Cards section */}
          <section className="absolute w-[76px] h-[21px] top-[241px] left-11 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
            <h2 className="[font-family:'Koulen',Helvetica] font-normal text-[#193455] text-xl tracking-[0] leading-[normal] whitespace-nowrap">
              my cards
            </h2>
          </section>

          {/* Badges section */}
          <section className="absolute w-[76px] h-[21px] top-[405px] left-[49px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1000ms]">
            <h2 className="[font-family:'Koulen',Helvetica] font-normal text-[#193455] text-xl text-center tracking-[0] leading-[normal] whitespace-nowrap">
              badges
            </h2>
          </section>

          {/* Bottom action cards container */}
          <div className="absolute w-[988px] h-[136px] top-[495px] left-[108px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1200ms]">
            <img
              className="w-full h-full"
              alt="Group"
              src="https://c.animaapp.com/mesjvl6vWsB6I2/img/group-93198.png"
            />

            {/* Action cards grid */}
            <div className="absolute top-[21px] left-[15px] flex items-center gap-[8px]">
              {actionCards.slice(0, 4).map((card, index) => (
                <Card
                  key={card.id}
                  className="relative w-[85px] h-[70px] bg-transparent border-0 cursor-pointer hover:scale-105 transition-transform"
                >
                  <CardContent className="p-0 h-full">
                    <img
                      className="w-full h-[51px] object-cover"
                      alt={`${card.label} icon`}
                      src={card.image}
                    />
                    <div className={`w-[85px] h-6 ${card.bgClass}`} />
                    <div className="absolute bottom-0 w-[76px] h-[21px] left-1 [font-family:'Koulen',Helvetica] font-normal text-white text-xl text-center tracking-[0] leading-[normal] whitespace-nowrap">
                      {card.label}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Apply button */}
              <Button
                className="w-[85px] h-[60px] mx-[70px] bg-transparent border-0 hover:bg-transparent h-auto"
                variant="ghost"
              >
                <span className="[font-family:'Koulen',Helvetica] font-normal text-[#193455] text-[32px] text-center tracking-[0] leading-[normal]">
                  apply
                </span>
              </Button>

              {actionCards.slice(4).map((card, index) => (
                <Card
                  key={card.id}
                  className="relative w-[85px] h-[70px] bg-transparent border-0 cursor-pointer hover:scale-105 transition-transform"
                >
                  <CardContent className="p-0 h-full">
                    <img
                      className="w-full h-[51px] object-cover"
                      alt={`${card.label} icon`}
                      src={card.image}
                    />
                    <div className={`w-[85px] h-6 ${card.bgClass}`} />
                    <div className="absolute bottom-0 w-[76px] h-[21px] left-1 [font-family:'Koulen',Helvetica] font-normal text-white text-xl text-center tracking-[0] leading-[normal] whitespace-nowrap">
                      {card.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* My Cards display */}
          <Card className="absolute w-[130px] h-[124px] top-[272px] left-[23px] bg-transparent border-0 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1400ms]">
            <CardContent className="p-0">
              <img
                className="w-full h-full object-cover"
                alt="Image"
                src="https://c.animaapp.com/mesjvl6vWsB6I2/img/image-169.png"
              />
            </CardContent>
          </Card>

          {/* Chat bubble */}
          <Card className="absolute w-[119px] h-[383px] top-[71px] left-[1124px] bg-transparent border-0 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1600ms]">
            <CardContent className="p-0 relative">
              <img
                className="w-full h-full"
                alt="Rectangle"
                src="https://c.animaapp.com/mesjvl6vWsB6I2/img/rectangle-5594.png"
              />

              <img
                className="absolute w-[164px] h-[109px] top-[-27px] left-[-29px] object-cover"
                alt="Chatgpt image"
                src="https://c.animaapp.com/mesjvl6vWsB6I2/img/chatgpt-image-2025-8-26--19-41-48-1.png"
              />

              <img
                className="absolute w-[91px] h-72 top-[78px] left-[14px]"
                alt="Rectangle"
                src="https://c.animaapp.com/mesjvl6vWsB6I2/img/rectangle-5654.png"
              />

              <div className="absolute w-[74px] top-[85px] left-[23px] [font-family:'Koulen',Helvetica] font-normal text-black text-[13px] tracking-[0] leading-[normal]">
                Good morning, little Guardian! The investment performance
                yesterday was quite good
                <br />
                Do you want to try any new challenges today?
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Left sidebar - Card deck */}
        <Card className="absolute w-[110px] h-[138px] top-[137px] left-8 bg-transparent border-0 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
          <CardContent className="p-0 relative">
            <div className="absolute w-[73px] h-[120px] top-[9px] left-[18px] bg-[#f2c672] rounded-[5px] rotate-[20.06deg]" />
            <img
              className="absolute w-[74px] h-[121px] top-[13px] left-3"
              alt="Group"
              src="https://c.animaapp.com/mesjvl6vWsB6I2/img/group-93179.png"
            />
          </CardContent>
        </Card>

        {/* User avatar and level */}
        <Card className="absolute w-[102px] h-[119px] top-3 left-8 bg-transparent border-0 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
          <CardContent className="p-0 relative">
            <div className="absolute w-[76px] h-[73px] top-0 left-0 bg-[#f77648] rounded-[38px/36.5px]" />

            <Badge className="absolute top-[72px] left-2 bg-transparent text-[#193455] hover:bg-transparent border-0 p-0">
              <span className="[font-family:'Koulen',Helvetica] font-normal text-2xl tracking-[0] leading-[normal]">
                Level 1
              </span>
            </Badge>

            <Avatar className="absolute w-[68px] h-[66px] top-[3px] left-1">
              <div className="w-full h-full bg-white rounded-[34px/33px]" />
              <AvatarImage
                className="absolute w-[58px] h-[58px] top-[7px] left-[9px] object-cover"
                src="https://c.animaapp.com/mesjvl6vWsB6I2/img/chatgpt-image-2025-8-26--18-47-24-1.png"
                alt="User avatar"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </CardContent>
        </Card>

        {/* Day counter and stars */}
        <Card className="absolute w-[218px] h-[70px] top-0 left-[1030px] bg-transparent border-0 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
          <CardContent className="p-0 relative">
            <div className="absolute w-32 h-[58px] top-3 left-[90px] bg-[#2571bc] rounded-[11px]" />

            <h2 className="absolute w-[94px] top-0 left-0 [font-family:'Koulen',Helvetica] font-normal text-[#193455] text-[40px] tracking-[0] leading-[normal] whitespace-nowrap">
              day 1
            </h2>

            <img
              className="absolute w-[41px] h-[41px] top-[19px] left-[104px]"
              alt="Star"
              src="https://c.animaapp.com/mesjvl6vWsB6I2/img/star-26.svg"
            />

            <span className="absolute w-[54px] h-10 top-[18px] left-[164px] [font-family:'Koulen',Helvetica] font-normal text-white text-[40px] tracking-[0] leading-[normal] whitespace-nowrap">
              15
            </span>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
