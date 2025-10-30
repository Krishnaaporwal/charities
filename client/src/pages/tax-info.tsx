import React from 'react';

const TaxInfo = () => {
    return (
      <div className="p-6 max-w-4xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-4">Understanding Tax & Crypto Donations</h1>
        <p className="mb-4">
          When you receive crypto donations in ETH, converting them to INR may result in taxation under capital gains laws.
          However, under <strong>Section 80G</strong> of the Income Tax Act, donations to registered NGOs are tax-free.
        </p>
        <h2 className="text-2xl font-semibold mb-2">How to Avoid Tax on Donations?</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Register your organization under <strong>Section 80G</strong> to make donations tax-exempt.</li>
          <li>Convert ETH donations via an NGO to ensure no tax liability.</li>
          <li>Use smart contract-based donation receipts to prove donations are non-taxable.</li>
          <li>Collaborate with registered NGOs to facilitate tax-free fundraising.</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-2">Benefits of Section 80G</h2>
        <p>
          If your crowdfunding campaign is tied to an NGO, all crypto donations are fully exempt from tax.
          Donors can also claim deductions on their contributions, making it beneficial for both parties.
        </p>
        <h2 className="text-2xl font-semibold mb-2">Collaborate with NGOs for Tax-Free Crowdfunding</h2>
        <p>
          To ensure your campaign remains tax-free, you can partner with NGOs that are already registered under Section 80G.
          These NGOs can legally accept crypto donations on your behalf and process them as tax-exempt contributions.
          This not only saves you from capital gains tax but also provides credibility to your campaign.
        </p>
        <h2 className="text-2xl font-semibold mb-2">Steps to Partner with an NGO</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Identify a registered NGO that aligns with your campaign's purpose.</li>
          <li>Sign a collaboration agreement to route crypto donations through them.</li>
          <li>Ensure the NGO provides official tax-exempt donation receipts for transparency.</li>
          <li>Use smart contracts to automate fund transfers and maintain blockchain transparency.</li>
        </ul>
        <p>
          By leveraging this approach, you not only comply with tax regulations but also enhance donor confidence,
          making it easier to attract large-scale contributions.
        </p>
      </div>
    );
  };

export default TaxInfo;
