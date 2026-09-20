import React, { useState } from 'react';

interface UserAvatarProps {
  src?: string;
  name: string;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ src, name, className = 'w-10 h-10' }) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (fullName: string) => {
    if (!fullName) return 'JS';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  if (!src || hasError) {
    return (
      <div
        className={`${className} rounded-full bg-gradient-to-br from-[#202532] to-[#13161f] border border-[#f59e0b] flex items-center justify-center font-telemetry font-bold text-[#ffc174] shadow-sm shrink-0`}
        title={name}
      >
        <span className="text-xs">{getInitials(name)}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setHasError(true)}
      className={`${className} rounded-full object-cover border border-[#f59e0b]/60 ring-2 ring-[#07090f] shrink-0`}
    />
  );
};
