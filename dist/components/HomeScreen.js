import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState.tsx';
import Aria from './Aria.tsx';
import Button from './Button.tsx';
import Header from './Header.tsx';
import TextWithFurigana from './TextWithFurigana.tsx';
import Modal from './Modal.tsx';
import ChipCalendar from './ChipCalendar.tsx';
import SpeechBubble from './SpeechBubble.tsx';
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
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsxs("main", { className: "flex-grow flex flex-col justify-center items-center p-6 space-y-1 relative", children: [_jsx(SpeechBubble, { message: ariaMessage, animation: "bounce-sm" }), _jsxs("div", { className: "relative -mt-2", children: [_jsx(Aria, { className: "w-48 h-48" }), playerState.chips === 0 && !hasClaimedDailyChipToday && mimichipImageData && (_jsx("div", { className: "absolute bottom-16 right-4 w-12 h-12 cursor-pointer transform hover:scale-110 transition-transform duration-200 animate-bounce-sm", onClick: handleDailyChipClick, role: "button", "aria-label": "\u30C7\u30A4\u30EA\u30FC\u30DF\u30DF\u30C1\u30C3\u30D7\u3092\u7372\u5F97", children: _jsx("img", { src: mimichipImageData, alt: "\u30C7\u30A4\u30EA\u30FC\u30DF\u30DF\u30C1\u30C3\u30D7" }) })), bonusMessage && (_jsx("div", { className: "absolute -top-4 inset-x-0 mx-auto text-center text-lg font-bold text-orange-500 animate-fade-in-out", children: bonusMessage }))] }), _jsxs("div", { className: "w-full max-w-xs space-y-4", children: [_jsx(Button, { text: normalModeText, onClick: handleNormalModeClick }), _jsx(Button, { variant: "secondary", text: trainingModeText, onClick: () => navigate('/training') })] })] }), _jsx(Modal, { isOpen: isResultModalOpen, onClose: () => setIsResultModalOpen(false), children: _jsxs("div", { className: "text-center space-y-4", children: [_jsx(TextWithFurigana, { content: { en: "Today's challenge is over!", ja: "今日の挑戦は終了！" }, jaClass: "text-2xl", enClass: "text-md" }), _jsx("p", { className: "text-gray-600 font-jp", children: "\u307E\u305F\u660E\u65E5\u6311\u6226\u3057\u3066\u306D\uFF01" }), _jsx("div", { className: "w-full h-auto bg-white/50 rounded-lg p-2 mt-4", children: _jsx(ChipCalendar, { history: playerState.chipHistory }) }), _jsx(Button, { text: { en: 'Close', ja: '閉じる' }, onClick: () => setIsResultModalOpen(false), variant: "secondary" })] }) })] }));
};
export default HomeScreen;
