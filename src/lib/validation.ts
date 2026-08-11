export type PassFormInput = {
  firstName: string;
  lastName: string;
  profileTitle: string;
  teamName: string;
  xUsername: string;
};

export type ValidationErrors = {
  firstName?: string;
  lastName?: string;
  profileTitle?: string;
  teamName?: string;
  xUsername?: string;
};

export const LIMITS = {
  firstName: 12,
  lastName: 14,
  profileTitle: 45,
  teamName: 18,
};

export function validatePassInput(input: PassFormInput): ValidationErrors {
  const errors: ValidationErrors = {};

  const cleanFirstName = input.firstName.trim();
  const cleanLastName = input.lastName.trim();
  const cleanTitle = input.profileTitle.trim();
  const cleanTeam = input.teamName.trim();

  if (cleanFirstName.length > LIMITS.firstName) {
    errors.firstName = `First name must be ${LIMITS.firstName} characters or fewer.`;
  }

  if (cleanLastName.length > LIMITS.lastName) {
    errors.lastName = `Last name must be ${LIMITS.lastName} characters or fewer.`;
  }

  if (cleanTitle.length > LIMITS.profileTitle) {
    errors.profileTitle = `Profile title must be ${LIMITS.profileTitle} characters or fewer.`;
  }

  if (cleanTeam.length > LIMITS.teamName) {
    errors.teamName = `Team name must be ${LIMITS.teamName} characters or fewer.`;
  }

  return errors;
}
