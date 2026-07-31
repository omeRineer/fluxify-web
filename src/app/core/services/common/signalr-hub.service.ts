import { inject, Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { from, Observable } from 'rxjs';
import { ToastService } from './toast.service';
import { HubConnectionStatus } from '../../models/common/signalr.models';
import { UserContextService } from './userContext.service';


export abstract class SignalrHubService {
  protected hubConnection!: signalR.HubConnection;
  protected connectionStatus = signal<HubConnectionStatus>('Connecting')
  protected toastService = inject(ToastService)
  protected userContext = inject(UserContextService)

  public connectionStatus$ = this.connectionStatus.asReadonly();

  constructor(protected hubUrl: string) {
    this.createConnection();
    this.userContext.onClear$.subscribe(this.disconnect)
  }


  private createConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000]) // Bağlantı koptuğunda bu aralıklarla tekrar dene
      .build();

    this.hubConnection.onclose(()=> this.connectionStatus.set('Disconnected'))
    this.hubConnection.onreconnected(()=> this.connectionStatus.set('Connected'))
    this.hubConnection.onreconnecting(()=> this.connectionStatus.set('Connecting'))

    this.registerEvents();
  }

  public connect() {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) return

    this.hubConnection.start()
      .then(() => {
        this.onHubConnected();
        this.connectionStatus.set('Connected')
      })
      .catch((err) => {
        console.log("Bağlantı hatası")
        this.connectionStatus.set('Error')
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
