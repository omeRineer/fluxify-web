import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { from, Observable } from 'rxjs';


export type HubConnectionStatus = 'Connected' | 'Connecting' | 'Disconnected';

export abstract class SignalrChannel {
  protected hubConnection!: signalR.HubConnection;

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
  }

  protected startConnection() {
    if (this.hubConnection.state === 'Connected') return

    this.registerEvents();

    this.hubConnection.start()
      .then(() => {
        console.log(`[SignalR - ${this.hubUrl}] Bağlantı başarıyla kuruldu.`);
        this.onHubConnected(); // Alt sınıflara bağlantı kurulduğu müjdesini ver
      })
      .catch((err) => {
        console.error(`[SignalR - ${this.hubUrl}] Bağlantı hatası:`, err);
      });
  }

  protected invokeHubMethod(methodName: string, ...args: any[]): Observable<void> {
    return from(this.hubConnection.invoke(methodName, ...args));
  }

  public async disconnect() {
    if (this.hubConnection) {
      await this.hubConnection.stop();
    }
  }

  protected abstract registerEvents():void;
  protected onHubConnected(): void { }
  protected onHubReconnected(): void { }

}
