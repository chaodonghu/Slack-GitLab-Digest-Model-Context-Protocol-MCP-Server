"use client";

import { useEffect, useState } from "react";
import { Avatar, ContentSection, Grid, Spinner } from "@zapier/design-system";

interface Zapien {
  name: string;
  hobby: string;
}

export function HelloWorld() {
  const [people, setPeople] = useState<Zapien[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://zapier.com/api/v4/i-was-here");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData: Zapien[] = await response.json();
        setPeople(jsonData);
      } catch (err: any) {
        setError(err.message || "Nododies here!");
      }
    };

    fetchData();
  }, []);

  return (
    <ContentSection>
      <h1
        style={{ marginTop: "40px", marginBottom: "20px", textAlign: "center" }}
      >
        Hello from the nextjs-template!
      </h1>

      {people.length > 0 ? (
        <Grid columns={3}>
          {people.map((person, index) => (
            <div
              key={index}
              style={{ marginBottom: "20px", textAlign: "center" }}
            >
              <div>
                <Avatar name={person.name} size="small" />
                <h4 style={{ display: "inline-block" }}>{person.name} </h4>
              </div>
              <p>{person.hobby}</p>
            </div>
          ))}
        </Grid>
      ) : (
        <Grid columns={1}>
          <div style={{ margin: "auto" }}>
            {error ? <p>{error}</p> : <Spinner />}
          </div>
        </Grid>
      )}
    </ContentSection>
  );
}
