// 画像のインポート
import obaImage from '../images/title.png';
import obaWhiteImage from '../images/oba-white.png';
import logoImage from '../images/logo.png';
import otnImage from '../images/otn.png';
import otnWhiteImage from '../images/otn-white.png';
import otnLogoImage from '../images/otn-logo.png';
import oniImage from '../images/oni.png';
import oniWhiteImage from '../images/oni-white.png';
import oniLogoImage from '../images/oni-logo.png';
import wnkImage from '../images/wnk.png';
import wnkWhiteImage from '../images/wnk-white.png';
import wnkLogoImage from '../images/wnk-logo.png';

export const BACKGROUND_COLORS = [
    '#F5F5F5', // おばあ
    '#E6F3FF', // おとん
    '#F0FFE6', // おにぃ（おねえ）
    '#FFE6E6'  // わんこ
];

export const CHARACTER_OPTIONS = [
    {
        text: 'おばあ',
        color: '#FF8C00',
        hoverColor: '#FFA500',
        src: obaImage,
        altSrc: obaWhiteImage,
        logoSrc: logoImage,
        alt: 'おばあ',
        font: 'Yuji Mai'
    },
    {
        text: 'おとん',
        color: '#4682B4',
        hoverColor: '#5F9EA0',
        src: otnImage,
        altSrc: otnWhiteImage,
        logoSrc: otnLogoImage,
        alt: 'おとん',
        font: 'Reggae One'
    },
    {
        text: 'おにぃ',
        color: '#228B22',
        hoverColor: '#32CD32',
        src: oniImage,
        altSrc: oniWhiteImage,
        logoSrc: oniLogoImage,
        alt: 'おにぃ',
        font: 'Hachi Maru Pop'
    },
    {
        text: 'わんこ',
        color: '#CD5C5C',
        hoverColor: '#F08080',
        src: wnkImage,
        altSrc: wnkWhiteImage,
        logoSrc: wnkLogoImage,
        alt: 'わんこ',
        font: 'Zen Antique'
    }
];

// フォント設定
export const FONT_FAMILIES = {
  DEFAULT: 'Zen Maru Gothic',
  OBA: 'Yuji Mai',
  OTN: 'Reggae One',
  ONI: 'Hachi Maru Pop',
  WNK: 'Zen Antique'
};

// 状態によって色を変えるためのマッピング
export const FACE_COLORS = {
  0: 'blue',    // 通常
  1: 'orange',  // 警告
  2: 'red',     // 危険
  3: 'black'    // その他
};
