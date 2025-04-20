"use client";

import { useState, useEffect, ChangeEvent } from "react";
import useSWR from "swr";

// Define interfaces for type safety
interface Advocate {
  id?: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: string;
  phoneNumber: string;
}

interface AdvocatesResponse {
  data: Advocate[];
}

export default function Home() {
  // Use SWR for data fetching with automatic caching and revalidation
  const { data, error, isLoading } = useSWR<AdvocatesResponse>(
    "/api/advocates", 
    { revalidateOnFocus: true }
  );
  
  const advocates = data?.data || [];
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>(advocates);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    const searchElement = document.getElementById("search-term");
    if (searchElement) {
      searchElement.innerHTML = searchTerm;
    }

    console.log("filtering advocates...");
    const filteredResults = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(searchTerm) ||
        advocate.lastName.includes(searchTerm) ||
        advocate.city.includes(searchTerm) ||
        advocate.degree.includes(searchTerm) ||
        // Check if specialties is an array before using includes
        (Array.isArray(advocate.specialties) 
          ? advocate.specialties.some(s => s && typeof s === 'string' && s.includes(searchTerm))
          : false) ||
        advocate.yearsOfExperience.includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredResults);
  };

  // Effect to update filtered advocates when new data is loaded
  useEffect(() => {
    if (data?.data) {
      setFilteredAdvocates(data.data);
    }
  }, [data]);

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      {/* Loading state */}
      {isLoading && (
        <div className="loading-container" style={{ textAlign: "center", padding: "20px" }}>
          <p>Loading advocates...</p>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="error-container" style={{ color: "red", padding: "20px" }}>
          <p>Error loading data: {error.message}</p>
        </div>
      )}
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input style={{ border: "1px solid black" }} onChange={onChange} />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <th>First Name</th>
          <th>Last Name</th>
          <th>City</th>
          <th>Degree</th>
          <th>Specialties</th>
          <th>Years of Experience</th>
          <th>Phone Number</th>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr key={advocate.id || `${advocate.firstName}-${advocate.lastName}-${advocate.phoneNumber}`}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div key={s}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
