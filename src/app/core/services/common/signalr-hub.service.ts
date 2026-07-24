import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { from, Observable } from 'rxjs';
import { ToastService } from './toast.service';


export abstract class SignalrHubService {
  protected hubConnection!: signalR.HubConnection;
  toastService = inject(ToastService)

  constructor(protected hubUrl: string) {
    this.createConnection();
  }


  private createConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000]) // Bağlantı koptuğunda bu aralıklarla tekrar dene
      .build();

    this.registerEvents();
  }

  public connect() {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) return

    this.hubConnection.start()
      .then(() => {
        console.log(`[SignalR - ${this.hubUrl}] Bağlantı başarıyla kuruldu.`);
        this.onHubConnected();
      })
      .catch((err) => {
        this.toastService.error(`[SignalR - ${this.hubUrl}] Bağlantı hatası`)
      });
  }
  public async disconnect() {
    if (this.hubConnection) {
      await this.hubConnection.stop();
    }
  }

  protected invokeHubMethod(methodName: string, ...args: any[]): Observable<void> {
    return from(this.hubConnection.invoke(methodName, ...args));
  }

  protected abstract registerEvents(): void;
  protected onHubConnected(): void { }
  protected onHubReconnected(): void { }

}
