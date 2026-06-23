import { Peer } from 'peerjs'

let peerInstance: Peer | null = null

export function getPeer(userId: string): Peer {
  if (peerInstance && !peerInstance.destroyed) {
    return peerInstance
  }

  peerInstance = new Peer(userId, {
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    },
  })

  return peerInstance
}

export function destroyPeer(): void {
  if (peerInstance && !peerInstance.destroyed) {
    peerInstance.destroy()
  }
  peerInstance = null
}
