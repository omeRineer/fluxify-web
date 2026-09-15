import { computed, signal, WritableSignal } from "@angular/core";

export abstract class BaseStore<TEntity extends { id: string }> {

  protected readonly state: WritableSignal<TEntity[]> = signal([]);

  readonly entities = this.state.asReadonly();
  readonly count = computed(() => this.state().length);
  readonly loading = signal(false);
  readonly loaded = signal(false);
  readonly error = signal<string | null>(null);

  load(items: TEntity[]) {
    this.state.set(items);
  }
  
  clear(): void {
    this.state.set([]);
  }

  add(item: TEntity): void {
    this.state.update(items => [...items, item]);
  }

  addRange(items: TEntity[]): void {
    this.state.update(current => [...current, ...items]);
  }

  update(item: TEntity): void {
    this.state.update(items =>
      items.map(x => x.id === item.id ? item : x)
    );
  }

  remove(id: string): void {
    this.state.update(items =>
      items.filter(x => x.id !== id)
    );
  }

  upsert(item: TEntity): void {
    this.state.update(items => {
      const index = items.findIndex(x => x.id === item.id);

      if (index === -1) {
        return [...items, item];
      }

      const copy = [...items];
      copy[index] = item;
      return copy;
    });
  }

  find(id: string): TEntity | undefined {
    return this.state().find(x => x.id === id);
  }
}