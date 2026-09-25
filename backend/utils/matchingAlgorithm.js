/**
 * Deterministic Commute Matching Engine (No AI dependency)
 * Calculates compatibility score (0 to 100) based on strict deterministic rules.
 */

// Helper to parse HH:MM AM/PM into minutes from midnight
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

/**
 * Calculates commute compatibility between user search criteria / profile and a ride offer
 */
const calculateMatchScore = (query, ride) => {
  let score = 0;

  // 1. College Match (Max 30 pts)
  if (query.college && ride.college) {
    if (query.college.trim().toLowerCase() === ride.college.trim().toLowerCase()) {
      score += 30;
    } else {
      // Incompatible college return 0
      return { score: 0, badge: 'Incompatible' };
    }
  } else {
    score += 30; // Default assuming same college platform context
  }

  // 2. Route Compatibility (Max 30 pts)
  let routeScore = 0;
  const qSource = (query.source || '').toLowerCase().trim();
  const qDest = (query.destination || '').toLowerCase().trim();
  const rSource = (ride.source || '').toLowerCase().trim();
  const rDest = (ride.destination || '').toLowerCase().trim();

  // Source Check
  if (qSource && rSource) {
    if (qSource === rSource) {
      routeScore += 15;
    } else if (qSource.includes(rSource) || rSource.includes(qSource)) {
      routeScore += 10;
    } else if (ride.pickupPoints && ride.pickupPoints.some(p => p.toLowerCase().includes(qSource))) {
      routeScore += 10;
    }
  } else {
    routeScore += 15;
  }

  // Destination Check
  if (qDest && rDest) {
    if (qDest === rDest) {
      routeScore += 15;
    } else if (qDest.includes(rDest) || rDest.includes(qDest)) {
      routeScore += 10;
    }
  } else {
    routeScore += 15;
  }
  score += routeScore;

  // 3. Time Compatibility (Max 20 pts)
  if (query.departureTime && ride.departureTime) {
    const qMins = parseTimeToMinutes(query.departureTime);
    const rMins = parseTimeToMinutes(ride.departureTime);

    if (qMins !== null && rMins !== null) {
      const diff = Math.abs(qMins - rMins);
      if (diff <= 10) {
        score += 20;
      } else if (diff <= 25) {
        score += 10;
      }
    } else {
      score += 10;
    }
  } else {
    score += 20;
  }

  // 4. Recurring Day Overlap (Max 20 pts)
  if (query.recurringDays && query.recurringDays.length > 0 && ride.recurringDays && ride.recurringDays.length > 0) {
    const matchingDays = query.recurringDays.filter(day => ride.recurringDays.includes(day));
    if (matchingDays.length === query.recurringDays.length) {
      score += 20;
    } else if (matchingDays.length > 0) {
      score += 10;
    } else {
      return { score: 0, badge: 'No Days Overlap' };
    }
  } else {
    score += 20;
  }

  // Determine Badge Label
  let badge = 'Possible Match';
  if (score >= 80) {
    badge = 'Highly Compatible';
  } else if (score >= 60) {
    badge = 'Good Match';
  }

  return { score, badge };
};

module.exports = {
  calculateMatchScore,
  parseTimeToMinutes
};
