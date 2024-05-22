// Kontekst menyusini o'chirish
document.oncontextmenu = () => {
    alert("Don't try right click");
    return false;
};

// Inspect elementni o'chirish va Ctrl + U tugmasini tekshirish
document.onkeydown = (e) => {
    if (e.key === "F12") {
        alert("Don't try to inspect element");
        return false;
    }
    
    // Sahifaning manbasini ko'rishni cheklash
    if (e.ctrlKey && e.key === "u") {
        alert("Don't try to view page sources");
        return false;
    }
    
    // Sahifadagi elementlarni nusxalashni cheklash
    if (e.ctrlKey && e.key === "c") {
        alert("Don't try to copy page element");
        return false;
    }
    
    // Sahifaga boshqa manbalardan ma'lumot kiritishni cheklash
    if (e.ctrlKey && e.key === "v") {
        alert("Don't try to paste anything to page");
        return false;
    }
};