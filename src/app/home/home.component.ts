import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('matrixCanvas', { static: false }) matrixCanvas!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private animationId!: number;
  private columns: number[] = [];

  categories = [
    {
      name: 'Programação',
      icon: '💻',
      route: '/categoria/programacao',
      description: 'Tutoriais e dicas de desenvolvimento'
    },
    {
      name: 'Jogos & Mods',
      icon: '🎮',
      route: '/categoria/jogos',
      description: 'Modding e desenvolvimento de jogos'
    },
    {
      name: 'Bateria',
      icon: '🥁',
      route: '/categoria/bateria',
      description: 'Técnicas e equipamentos'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMatrix();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private initMatrix(): void {
    const canvas = this.matrixCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    this.resizeCanvas();
    this.animate();
  }

  private resizeCanvas(): void {
    const canvas = this.matrixCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const fontSize = 14;
    const columnCount = Math.floor(canvas.width / fontSize);
    this.columns = Array(columnCount).fill(0).map(() => Math.random() * canvas.height);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.resizeCanvas();
  }

  private animate(): void {
    const canvas = this.matrixCanvas.nativeElement;
    const ctx = this.ctx;
    const fontSize = 14;
    
    // Semi-transparent purple for trail effect
    ctx.fillStyle = 'rgba(25, 0, 50, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Matrix characters
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/{}[]();:=+-*&^%$#@!';
    
    ctx.font = `${fontSize}px monospace`;
    
    for (let i = 0; i < this.columns.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = this.columns[i];
      
      // Softer green color - less intense
      const brightness = Math.random();
      if (brightness > 0.98) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      } else if (brightness > 0.9) {
        ctx.fillStyle = 'rgba(160, 232, 176, 0.9)';
      } else {
        ctx.fillStyle = `rgba(100, ${160 + Math.random() * 60}, 120, ${0.3 + Math.random() * 0.3})`;
      }
      
      ctx.fillText(char, x, y);
      
      // Reset column when it goes off screen
      if (y > canvas.height && Math.random() > 0.975) {
        this.columns[i] = 0;
      }
      
      // Velocidade mais lenta (incremento menor)
      this.columns[i] += fontSize * 0.4;
    }
    
    // Delay para animação mais lenta
    setTimeout(() => {
      this.animationId = requestAnimationFrame(() => this.animate());
    }, 50);
  }
}
