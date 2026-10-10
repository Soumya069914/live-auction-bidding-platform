export type AuctionStatus = 'UPCOMING' | 'LIVE' | 'ENDED';

export interface Auction {
id: number;
title: string;
description: string;
imageUrl: string;
category: string;
startingPrice: number;
currentPrice: number;
minimumBidIncrement?: number;
totalBids: number;
sellerName: string;
startTime: string;
endTime: string;
status: AuctionStatus;
}
