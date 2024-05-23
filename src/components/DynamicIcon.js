import React, { useState, useEffect } from 'react';

function DynamicIcon({ iconName }) {
  const [Icon, setIcon] = useState(null);

  useEffect(() => {
    if (iconName) {
      import(`@mui/icons-material/${iconName}`)
        .then((module) => {
          setIcon(() => module.default);
        })
        .catch(error => {
          console.error(`"${iconName}" not found in @mui/icons-material`);
          setIcon(null);
        });
    }
  }, [iconName]);

  if (!Icon) return null; // or render a fallback

  return <Icon />;
}

export default DynamicIcon;
