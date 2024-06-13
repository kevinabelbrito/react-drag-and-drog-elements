import { useEffect, useRef, useState } from 'react';
import './App.css'

function App() {

  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dropZonesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedCard, setSelectedCard] = useState<HTMLDivElement | null>(null);
  const [currentDropZone, setCurrentDropZone] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      event.preventDefault();
      const card = (event.target as HTMLElement).closest('.card') as HTMLDivElement;
      setSelectedCard(card);
      const dropZone = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY)?.closest('.base, #off') as HTMLDivElement;
      setCurrentDropZone(dropZone);
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      const touch = event.touches[0];
      if (selectedCard) {
        selectedCard.style.position = 'absolute';
        selectedCard.style.left = `${touch.pageX - selectedCard.offsetWidth / 2}px`;
        selectedCard.style.top = `${touch.pageY - selectedCard.offsetHeight / 2}px`;
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      event.preventDefault();
      const dropZone = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY)?.closest('.base, #off') as HTMLDivElement;
      if (dropZone) {
        putCardInDropZone(dropZone);
      }
    };

    const handleDragStart = (event: DragEvent | TouchEvent) => {
      const card = (event.target as HTMLElement).closest('.card') as HTMLDivElement;
      setSelectedCard(card);
      if ('changedTouches' in event) {
        const dropZone = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY)?.closest('.base, #off') as HTMLDivElement;
        setCurrentDropZone(dropZone);
      }
    };

    const putCardInDropZone = (dropZone: HTMLDivElement) => {
      if (selectedCard) {
        dropZone.prepend(selectedCard);
        selectedCard.style.position = 'static';
        if (currentDropZone?.id !== dropZone?.id) {
          setSelectedCard(null);
          setCurrentDropZone(null);
        }
      }
    };

    cardsRef.current.forEach(card => {
      if (card) {
        card.addEventListener('dragstart', handleDragStart as EventListener);
        card.addEventListener('touchstart', handleTouchStart, { passive: false });
        card.addEventListener('touchmove', handleTouchMove, { passive: false });
        card.addEventListener('touchend', handleTouchEnd, { passive: false });
      }
    });

    dropZonesRef.current.forEach(zone => {
      if (zone) {
        zone.addEventListener('dragover', (event) => {
          event.preventDefault();
        });
        zone.addEventListener('drop', (event) => {
          event.preventDefault();
          putCardInDropZone(zone);
        });
        zone.addEventListener('touchend', handleTouchEnd, { passive: false });
      }
    });

    return () => {
      cardsRef.current.forEach(card => {
        if (card) {
          card.removeEventListener('dragstart', handleDragStart as EventListener);
          card.removeEventListener('touchstart', handleTouchStart);
          card.removeEventListener('touchmove', handleTouchMove);
          card.removeEventListener('touchend', handleTouchEnd);
        }
      });

      dropZonesRef.current.forEach(zone => {
        if (zone) {
          zone.removeEventListener('dragover', (event) => {
            event.preventDefault();
          });
          zone.removeEventListener('drop', (event) => {
            event.preventDefault();
            putCardInDropZone(zone);
          });
          zone.removeEventListener('touchend', handleTouchEnd);
        }
      });
    };
  }, [selectedCard, currentDropZone]);

  return (
    <div className="container">
      <div id="off" ref={(el) => (dropZonesRef.current[0] = el)}>
        {[1, 2, 3].map(num => (
          <div
            className="card"
            id={`card${num}`}
            draggable="true"
            key={num}
            ref={(el) => (cardsRef.current[num - 1] = el)}
          >
            <h3>Item {num}</h3>
          </div>
        ))}
      </div>
      <div className="field">
        <div className="base-unique">
          <div className="base" id="drop-zone2" ref={(el) => (dropZonesRef.current[1] = el)}></div>
        </div>
        <div className="base-two">
          <div className="base" id="drop-zone1" ref={(el) => (dropZonesRef.current[2] = el)}></div>
          <div className="base" id="drop-zone3" ref={(el) => (dropZonesRef.current[3] = el)}></div>
        </div>
        <div className="base-unique">
          <div className="base" id="drop-zone" ref={(el) => (dropZonesRef.current[4] = el)}></div>
        </div>
      </div>
    </div>
  )
}

export default App
