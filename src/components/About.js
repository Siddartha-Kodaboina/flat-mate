import React from 'react';

const About = () => {
  return (
    <div className="bg-sky-100 p-6 md:py-12 lg:px-[300px] md:px-[200px]">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Purpose of the App</h1>
        <p className="mb-4 text-gray-700">
          The primary purpose of flatmate.pro is to connect people who are looking for shared housing with those who have vacancies in their flats. It serves as a centralized platform to facilitate the search and communication process, making it easier for both vacancy creators and seekers to find suitable housing arrangements.
        </p>

        <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">Real-World Problems Solved</h2>
        
        <h3 className="text-xl font-semibold text-blue-700 mt-6 mb-2">Uncertainty in Lease Continuation</h3>
        <p className="mb-4 text-gray-700">
          As an international student, you may find yourself in a situation where some of your roommates graduate and move out, leaving you uncertain about whether to continue the lease, find new roommates, or move to a new place.
          <br/>
          <span className='text-l font-bold text-green-600'>Solution</span>: flatmate.pro allows you to list the available spots in your flat, making it easier to find new roommates who are looking for housing in your area.
        </p>

        <h3 className="text-xl font-semibold text-blue-700 mt-6 mb-2">Limited Reach of Traditional Methods</h3>
        <p className="mb-4 text-gray-700">
          Traditional methods like posting in WhatsApp groups or on social media have limited reach and may not connect you with a large enough pool of potential roommates.
          <br/>
          <span className='text-l font-bold text-green-600'>Solution</span>: By using a dedicated platform like flatmate.pro, you can reach a wider audience of people actively looking for shared housing, increasing your chances of finding the right match.
        </p>

        <h3 className="text-xl font-semibold text-blue-700 mt-6 mb-2">Streamlined Communication</h3>
        <p className="mb-4 text-gray-700">
          Coordinating with potential roommates through various messaging platforms can be cumbersome and disorganized.
          <br/>
          <span className='text-l font-bold text-green-600'>Solution</span>: flatmate.pro provides a built-in communication feature, allowing vacancy creators and seekers to message each other directly within the app, keeping all related conversations in one place.
        </p>

        <h3 className="text-xl font-semibold text-blue-700 mt-6 mb-2">Detailed Listings</h3>
        <p className="mb-4 text-gray-700">
          Inadequate information about available housing can lead to wasted time and mismatched expectations.
          <br/>
          <span className='text-l font-bold text-green-600'>Solution</span>: The app allows vacancy creators to provide detailed listings with availability dates, rent, current tenants, amenities, and reviews, giving seekers a clear understanding of what is being offered.
        </p>

        <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">Real-World Example</h2>
        <p className="mb-4 text-gray-700">
          <li>Imagine you are an international student named Alex. You and four friends have been sharing an apartment. This summer, three of your friends graduated and are moving to different cities for work. You’re now left with a dilemma: should you find new roommates to continue the lease, move to a different apartment, or end the lease altogether?</li>
          <li>Without a platform like flatmate.pro, you would likely post in WhatsApp groups or social media, hoping to find someone interested. This method is time-consuming and unreliable, often leaving you stressed about finding replacements quickly.</li>
          <li>With flatmate.pro, you create a listing for your apartment vacancy, detailing the available rooms, rent, current tenants (including you), amenities, and nearby landmarks. Potential roommates can search for housing in your city, see your listing, and contact you directly through the app. This streamlined process not only saves time but also increases the likelihood of finding compatible roommates, allowing you to continue your lease without hassle.</li>
        </p>

        <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">Summary</h2>
        <p className="mb-4 text-gray-700">
          In summary, flatmate.pro addresses significant pain points in the shared housing market, offering a convenient and effective solution for both vacancy creators and seekers.
        </p>
      </div>
    </div>
  );
};

export default About;
