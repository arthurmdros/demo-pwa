import { Injectable } from '@angular/core';

type Theme = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storageKey = 'user-theme';
  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    // aplica imediatamente a preferência salva (ou system)
    this.applyInitialTheme();

    // se o usuário escolheu "system", escuta mudanças do sistema
    this.mediaQuery.addEventListener?.('change', (e) => {
      const saved = this.getTheme();
      if (saved === 'system') {
        this.applyClassForSystem(e.matches);
      }
    });
  }

  private applyInitialTheme() {
    const saved = this.getTheme();
    if (saved === 'dark') {
      this.setClass('dark');
    } else if (saved === 'light') {
      this.setClass('light');
    } else {
      // system: remove classes e deixa @media cuidar
      document.documentElement.classList.remove('dark-theme', 'light-theme');
    }
  }

  setTheme(theme: Theme) {
    if (theme === 'system') {
      localStorage.removeItem(this.storageKey);
      document.documentElement.classList.remove('dark-theme', 'light-theme');
    } else {
      localStorage.setItem(this.storageKey, theme);
      this.setClass(theme);
    }
  }

  getTheme(): Theme {
    return (localStorage.getItem(this.storageKey) as Theme) || 'system';
  }

  private setClass(theme: 'light' | 'dark') {
    document.documentElement.classList.remove('dark-theme', 'light-theme');
    document.documentElement.classList.add(theme === 'dark' ? 'dark-theme' : 'light-theme');
  }

  private applyClassForSystem(isDark: boolean) {
    document.documentElement.classList.remove('dark-theme', 'light-theme');
    // não adiciona classe, apenas garante que as variáveis do @media sejam aplicadas.
    // Se você quiser forçar classe em "system" quando o sistema muda, comente a linha acima
    // e use:
    // document.documentElement.classList.add(isDark ? 'dark-theme' : 'light-theme');
  }
}
