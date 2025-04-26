import React, { useState, useEffect } from 'react';
import { metadataService } from '../utils/api';
import { motion } from 'framer-motion';

const AboutPage = () => {
    const [metadata, setMetadata] = useState(null);

    useEffect(() => {
        const fetchMetadata = async () => {
            const response = await metadataService.get();
            setMetadata(response.data);
        };
        fetchMetadata();
    }, []);

    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div
                className="max-w 3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}>
                <h1 className="text-3xl font-bold mb-2 text-center text-text">About Us</h1>
                <p className="text-muted mb-8 text-center">
                    Excerpt about us...
                </p>
            </motion.div>
        </div>
    )
};

export default AboutPage;