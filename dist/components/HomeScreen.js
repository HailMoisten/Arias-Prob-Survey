import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState.js';
import Aria from './Aria.js';
import Button from './Button.js';
import Header from './Header.js';
import TextWithFurigana from './TextWithFurigana.js';
import Modal from './Modal.js';
import ChipCalendar from './ChipCalendar.js';
import SpeechBubble from './SpeechBubble.js';
const HomeScreen = () => {
    const navigate = useNavigate();
    const { playerState, canPlayNormalMode, claimDailyChip, hasClaimedDailyChipToday } = useGameState();
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [bonusMessage, setBonusMessage] = useState(null);
    const [mimichipImageData, setMimichipImageData] = useState('');
    const [ariaMessage, setAriaMessage] = useState({ en: '', ja: '' });
    const [showNoChipMessage, setShowNoChipMessage] = useState(false);
    useEffect(() => {
        fetch('./data/base64/mimichip.txt')
            .then(response => response.text())
            .then(data => setMimichipImageData(data.trim()));
    }, []);
    const defaultMessages = [
        { en: "Wanna try your luck today?", ja: "運試ししていく？" },
        { en: "Ready for a challenge?", ja: "腕試ししていく？" },
        { en: "Let's check today's probability!", ja: "今日はどんな日かな？" }
    ];
    useEffect(() => {
        if (showNoChipMessage) {
            setAriaMessage({ en: "Looks like you have no Mimichips. Here, take this!", ja: "ミミチップがないみたいだね。これをどうぞ！" });
        }
        else {
            const day = new Date().getDate();
            setAriaMessage(defaultMessages[day % defaultMessages.length]);
        }
    }, [hasClaimedDailyChipToday, playerState.chips, showNoChipMessage]);
    const normalModeText = { en: "Today's Question", ja: '今日の１問' };
    const trainingModeText = { en: 'Training Mode', ja: 'トレーニング' };
    const handleNormalModeClick = () => {
        if (playerState.chips === 0 && !hasClaimedDailyChipToday) {
            setShowNoChipMessage(true);
            return;
        }
        if (canPlayNormalMode) {
            navigate('/game');
        }
        else {
            setIsResultModalOpen(true);
        }
    };
    const handleDailyChipClick = () => {
        const claimed = claimDailyChip();
        if (claimed) {
            setShowNoChipMessage(false);
            setBonusMessage('+1 ミミチップ！');
            setTimeout(() => setBonusMessage(null), 2000);
        }
    };
    return (jsxs(Fragment, { children: [jsx(Header, {}), jsxs("main", { className: "flex-grow flex flex-col justify-center items-center p-6 space-y-1 relative", children: [jsx(SpeechBubble, { message: ariaMessage, animation: "bounce-sm" }), jsxs("div", { className: "relative -mt-2", children: [jsx(Aria, { className: "w-48 h-48" }), playerState.chips === 0 && !hasClaimedDailyChipToday && mimichipImageData && (jsx("div", { className: "absolute bottom-16 right-4 w-12 h-12 cursor-pointer transform hover:scale-110 transition-transform duration-200 animate-bounce-sm", onClick: handleDailyChipClick, role: "button", "aria-label": "デイリーミミチップを獲得", children: jsx("img", { src: mimichipImageData, alt: "デイリーミミチップ" }) })), bonusMessage && (jsx("div", { className: "absolute -top-4 inset-x-0 mx-auto text-center text-lg font-bold text-orange-500 animate-fade-in-out", children: bonusMessage }))] }), jsxs("div", { className: "w-full max-w-xs space-y-4", children: [jsx(Button, { text: normalModeText, onClick: handleNormalModeClick }), jsx(Button, { variant: "secondary", text: trainingModeText, onClick: () => navigate('/training') })] })] }), jsx(Modal, { isOpen: isResultModalOpen, onClose: () => setIsResultModalOpen(false), children: jsxs("div", { className: "text-center space-y-4", children: [jsx(TextWithFurigana, { content: { en: "Today's challenge is over!", ja: "今日の挑戦は終了！" }, jaClass: "text-2xl", enClass: "text-md" }), jsx("p", { className: "text-gray-600 font-jp", children: "また明日挑戦してね！" }), jsx("div", { className: "w-full h-auto bg-white/50 rounded-lg p-2 mt-4", children: jsx(ChipCalendar, { history: playerState.chipHistory }) }), jsx(Button, { text: { en: 'Close', ja: '閉じる' }, onClick: () => setIsResultModalOpen(false), variant: "secondary" })] }) })] }));
};
export default HomeScreen;
