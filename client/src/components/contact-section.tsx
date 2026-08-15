import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Send, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6"
          >
            Ready to Work Together?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            Contact our team to discuss how TOTAG Group can support your business needs across our diverse range of services.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Email Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white rounded-2xl p-8 shadow-lg h-full">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
                  <p className="text-gray-600 mb-4">Send us a message and we'll respond within 24 hours</p>
                  <a 
                    href="mailto:tis@totaggroup.com" 
                    className="text-primary font-semibold hover:text-primary/80 transition-colors duration-200"
                  >
                    tis@totaggroup.com
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            {/* Phone Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white rounded-2xl p-8 shadow-lg h-full">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
                  <p className="text-gray-600 mb-4">Speak directly with our business development team</p>
                  <a 
                    href="tel:+231777666999" 
                    className="text-primary font-semibold hover:text-primary/80 transition-colors duration-200"
                  >
                    +(231) 777-666-999
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            {/* Location Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white rounded-2xl p-8 shadow-lg h-full">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Us</h3>
                  <p className="text-gray-600 mb-4">Our main office location</p>
                  <div className="text-primary font-semibold">
                    <p>Guest House Road</p>
                    <p>Thinker's Village Community</p>
                    <p>Paynesville, Montserrado County</p>
                    <p>Liberia</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button
              asChild
              className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <a href="mailto:tis@totaggroup.com">
                <Send className="mr-2 h-4 w-4" />
                <span>Send Message</span>
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
