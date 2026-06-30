type AuthSession = {
  phone?: string;
  otp?: string;
  profileComplete: boolean;
};

const session: AuthSession = {
  profileComplete: false,
};

const knownProfilePhones = new Set(["9876543210", "9999999999"]);

export function generateOtp(phone: string) {
  const normalizedPhone = phone.replace(/\D/g, "");
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  session.phone = normalizedPhone;
  session.otp = otp;
  session.profileComplete = knownProfilePhones.has(normalizedPhone);

  return otp;
}

export function verifyOtp(otp: string) {
  return Boolean(session.otp && otp === session.otp);
}

export function hasProfileDetails() {
  return session.profileComplete;
}

export function saveProfileDetails() {
  if (session.phone) {
    knownProfilePhones.add(session.phone);
  }

  session.profileComplete = true;
}

export function getSessionPhone() {
  return session.phone;
}
