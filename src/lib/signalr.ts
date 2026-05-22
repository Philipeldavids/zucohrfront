import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export const getConnection = () => {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:44318/hubs/notifications", {
        accessTokenFactory: () => localStorage.getItem("token") || "",
      })
      .withAutomaticReconnect()
      .build();
  }

  return connection;
};