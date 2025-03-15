import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ: React.FC = () => {
  const faqItems = [
    {
      question: "How do I create a campaign?",
      answer: "To create a campaign, you'll need to connect your cryptocurrency wallet (like MetaMask), then click on \"Start a Campaign\" button. Fill out the required information including campaign title, description, funding goal, and deadline. You'll pay a small gas fee to deploy your campaign to the blockchain."
    },
    {
      question: "What cryptocurrencies can I use to donate?",
      answer: "Currently, our platform supports donations in ETH (Ethereum) and MATIC (Polygon). We plan to add support for more cryptocurrencies and tokens in the future."
    },
    {
      question: "What happens if a campaign doesn't reach its funding goal?",
      answer: "If a campaign doesn't reach its funding goal by the deadline, donors can request refunds of their contributions. The smart contract will automatically return the funds to the donor's wallet address upon request."
    },
    {
      question: "Are there any fees for using the platform?",
      answer: "Yes, our platform charges a small fee of 2-5% on successfully funded campaigns. This fee is automatically deducted when the campaign creator withdraws the funds. Additionally, users pay blockchain gas fees for transactions like creating campaigns and making donations."
    },
    {
      question: "How is my data secured on the platform?",
      answer: "All campaign and donation data is stored on the blockchain, which provides immutable and transparent record-keeping. Campaign media and additional information are stored on IPFS, a decentralized storage system. We never store your private keys or wallet seed phrases."
    }
  ];

  return (
    <section className="py-16" id="faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our decentralized crowdfunding platform.
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-border">
          <Accordion type="single" collapsible defaultValue="item-0">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-xl font-medium py-6">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
