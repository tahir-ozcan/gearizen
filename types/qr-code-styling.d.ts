// types/qr-code-styling.d.ts

// Basit ama yeterli bir tip bildirimi:
declare module "qr-code-styling" {
  export interface Options {
    width?: number;
    height?: number;
    data?: string;
    margin?: number;
    qrOptions?: { errorCorrectionLevel?: "L" | "M" | "Q" | "H" };
    image?: string;
    imageOptions?: { crossOrigin?: string; margin?: number };
    dotsOptions?: { color?: string; type?: string };
    backgroundOptions?: { color?: string };
  }

  export default class QRCodeStyling {
    constructor(options: Options);
    // png, svg, jpeg için ham veriyi döner
    getRawData(type?: "png" | "svg" | "jpeg"): Promise<ArrayBuffer>;
    // canvas elementine render etmek isterseniz:
    append(domNode: HTMLElement): void;
    // Data URL almak
    toDataURL(type?: "png" | "svg" | "jpeg"): Promise<string>;
  }
}