import { Injectable } from '@angular/core';

export interface Post {
  id: number;
  title: string;
  category: string;
  description: string;
  content: string;
  image: string;
  author: string;
  date: Date;
  tags: string[];
  featured: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [
    {
      id: 1,
      title: 'Como Criar um Mod Menu Profissional para GTA V',
      category: 'jogos',
      description: 'Aprenda a criar mod menus seguros e funcionais para GTA V usando C++ e técnicas de memory injection.',
      content: 'Tutorial completo sobre desenvolvimento de mod menus...',
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      author: 'João Silva',
      date: new Date('2025-01-10'),
      tags: ['GTA V', 'C++', 'Mod Menu', 'Game Hacking'],
      featured: true
    },
    {
      id: 2,
      title: 'Angular 18: Novidades e Recursos que Você Precisa Conhecer',
      category: 'programacao',
      description: 'Descubra as novas funcionalidades do Angular 18 e como elas podem melhorar seus projetos.',
      content: 'O Angular 18 trouxe diversas melhorias...',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      author: 'Maria Santos',
      date: new Date('2025-01-09'),
      tags: ['Angular', 'TypeScript', 'Web Development', 'Frontend'],
      featured: true
    },
    {
      id: 3,
      title: 'Técnicas Avançadas de Bateria: Double Bass e Blast Beats',
      category: 'bateria',
      description: 'Domine as técnicas mais desafiadoras da bateria e leve sua performance ao próximo nível.',
      content: 'Aprenda técnicas avançadas de bateria...',
      image: 'https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=800',
      author: 'Carlos Drummer',
      date: new Date('2025-01-08'),
      tags: ['Bateria', 'Técnicas', 'Metal', 'Rock'],
      featured: true
    },
    {
      id: 4,
      title: 'Python para Iniciantes: Do Zero ao Primeiro Projeto',
      category: 'programacao',
      description: 'Guia completo para quem está começando na programação com Python.',
      content: 'Python é uma das linguagens mais populares...',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
      author: 'Ana Costa',
      date: new Date('2025-01-07'),
      tags: ['Python', 'Iniciantes', 'Tutorial', 'Programação'],
      featured: false
    },
    {
      id: 5,
      title: 'Melhores Mods para Minecraft em 2025',
      category: 'jogos',
      description: 'Confira os mods mais incríveis que vão transformar sua experiência no Minecraft.',
      content: 'Lista dos melhores mods de Minecraft...',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      author: 'Pedro Gamer',
      date: new Date('2025-01-06'),
      tags: ['Minecraft', 'Mods', 'Gaming', 'Java'],
      featured: false
    },
    {
      id: 6,
      title: 'Como Afinar sua Bateria Acústica Perfeitamente',
      category: 'bateria',
      description: 'Técnicas profissionais de afinação para obter o melhor som da sua bateria.',
      content: 'Afinação é essencial para um bom som...',
      image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
      author: 'Ricardo Batista',
      date: new Date('2025-01-05'),
      tags: ['Bateria', 'Afinação', 'Manutenção', 'Acústica'],
      featured: false
    },
    {
      id: 7,
      title: 'React vs Angular: Qual Framework Escolher em 2025?',
      category: 'programacao',
      description: 'Comparação detalhada entre os dois principais frameworks para desenvolvimento web.',
      content: 'Análise completa de React e Angular...',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      author: 'Lucas Dev',
      date: new Date('2025-01-04'),
      tags: ['React', 'Angular', 'JavaScript', 'Frontend'],
      featured: false
    },
    {
      id: 8,
      title: 'Desenvolvendo Cheats para CS2: Guia Ético e Educacional',
      category: 'jogos',
      description: 'Aprenda sobre game hacking de forma ética, entendendo os fundamentos técnicos.',
      content: 'Game hacking para fins educacionais...',
      image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800',
      author: 'Felipe Tech',
      date: new Date('2025-01-03'),
      tags: ['CS2', 'Game Hacking', 'C++', 'Reversing'],
      featured: false
    },
    {
      id: 9,
      title: 'Ritmos Brasileiros na Bateria: Samba e Bossa Nova',
      category: 'bateria',
      description: 'Explore os ritmos brasileiros e aprenda a tocar samba e bossa nova na bateria.',
      content: 'Os ritmos brasileiros são únicos...',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      author: 'Bruno Ritmo',
      date: new Date('2025-01-02'),
      tags: ['Bateria', 'Samba', 'Bossa Nova', 'Música Brasileira'],
      featured: false
    },
    {
      id: 10,
      title: 'TypeScript 5.4: Type-Safe by Default',
      category: 'programacao',
      description: 'Conheça as novidades do TypeScript 5.4 e como escrever código mais seguro.',
      content: 'TypeScript continua evoluindo...',
      image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800',
      author: 'Juliana Code',
      date: new Date('2025-01-01'),
      tags: ['TypeScript', 'JavaScript', 'Type Safety', 'Programming'],
      featured: false
    },
    {
      id: 11,
      title: 'Como Instalar e Usar Mods no Skyrim Special Edition',
      category: 'jogos',
      description: 'Tutorial passo a passo para modding no Skyrim usando Nexus Mod Manager e SKSE.',
      content: 'Skyrim é um dos jogos mais moddados...',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      author: 'Gabriel Modder',
      date: new Date('2024-12-30'),
      tags: ['Skyrim', 'Modding', 'RPG', 'Gaming'],
      featured: false
    },
    {
      id: 12,
      title: 'Construindo sua Primeira Bateria Eletrônica DIY',
      category: 'bateria',
      description: 'Projeto completo para construir uma bateria eletrônica caseira com Arduino.',
      content: 'Bateria eletrônica DIY com Arduino...',
      image: 'https://images.unsplash.com/photo-1519508234439-4f23643125c1?w=800',
      author: 'Rodrigo Maker',
      date: new Date('2024-12-29'),
      tags: ['Bateria', 'DIY', 'Arduino', 'Eletrônica'],
      featured: false
    }
  ];

  constructor() { }

  getAllPosts(): Post[] {
    return this.posts.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getFeaturedPosts(): Post[] {
    return this.posts.filter(post => post.featured);
  }

  getPostsByCategory(category: string): Post[] {
    return this.posts
      .filter(post => post.category === category)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getPostById(id: number): Post | undefined {
    return this.posts.find(post => post.id === id);
  }

  getRecentPosts(limit: number = 5): Post[] {
    return this.posts
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  }

  getCategoryInfo(category: string): { name: string; icon: string; description: string } {
    const categories: { [key: string]: { name: string; icon: string; description: string } } = {
      'programacao': {
        name: 'Programação',
        icon: '💻',
        description: 'Tutoriais, notícias e dicas sobre desenvolvimento de software'
      },
      'jogos': {
        name: 'Jogos & Mods',
        icon: '🎮',
        description: 'Modding, game development e notícias do mundo dos games'
      },
      'bateria': {
        name: 'Bateria',
        icon: '🥁',
        description: 'Técnicas, tutoriais e equipamentos para bateristas'
      }
    };
    return categories[category] || { name: category, icon: '📰', description: 'Categoria de notícias' };
  }
}
