import Mailer from "../services/mailer";
import Logger from "../utils/pino";

const connectMailService = async () => {
  const mailer = Mailer.getInstance();

  Logger.info('- Connecting with SMTP Server...');
  
  try {
    await mailer.createConnection();
    Logger.info('- SMTP Server Connected');

    mailer.verifyConnection();
  } catch (error) {
    Logger.error('ERROR: Error trying to connect to SMTP Server');
  }
};

export default connectMailService;
