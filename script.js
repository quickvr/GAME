const dealButton = document.getElementById('deal-button');
const messages = document.getElementById('messages');
const playerHand = document.getElementById('player-hand');
const aiHand = document.getElementById('ai-hand');

const deck = [...Array(52).keys()]; // Simple representation of a deck of cards

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCards() {
    shuffleDeck();
    const playerCards = [deck.pop(), deck.pop()];
    const aiCards = [deck.pop(), deck.pop()];
    
    playerHand.innerHTML = `Player Cards: ${playerCards.join(', ')}`;
    aiHand.innerHTML = `AI Cards: ${aiCards.join(', ')}`;
    
    // Simple AI decision
    const aiDecision = Math.random() < 0.5 ? "AI stays" : "AI folds";
    messages.innerHTML = aiDecision;
}

dealButton.addEventListener('click', dealCards);
